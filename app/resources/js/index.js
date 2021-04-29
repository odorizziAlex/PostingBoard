/* eslint-env browser */
import PostViews from "./views/PostViews.js";
import UploadView from "./views/UploadView.js";
import FilterView from "./views/FilterView.js";
import RegisterView from "./views/RegisterView.js";
import LoginView from "./views/LoginView.js";
import ForgotPasswordView from "./views/ForgotPasswordView.js";
import ResetPasswordView from "./views/ResetPasswordView.js";
import PostsController from "./controller/PostsController.js";
import PostsModel from "./model/PostsModel.js";
import UserAuth from "./user-authentication/UserAuth.js";
import MenuView from "./views/MenuView.js";
import ToastView from "./views/ToastView.js";
import EditProfileView from "./views/EditProfileView.js";
import HeaderView from "./views/HeaderView.js";
import CalenderView from "./views/CalenderView.js";
import Config from "./utils/Config.js";
import InputChecker from "./utils/InputChecker.js";
import PostDetailView from "./views/PostDetailView.js";
import DeletePostPopupView from "./views/DeletePostPopupView.js";
import DeleteProfilePopupView from "./views/DeleteProfilePopupView.js";
import FirebaseDB from "./database/FirebaseDB.js";
import ConnectionHandler from "./utils/ConnectionHandler.js";
import NoConnectionPopupView from "./views/NoConnectionPopupView.js";
import ImageCompressor from "./utils/ImageCompressor.js";
import Shortcuts from "./utils/Shortcuts.js";
import DownloadPopupView from "./views/DownloadPopupView.js";
import FullImageView from "./views/FullImageView.js";
import CookieManager from "./utils/CookieManager.js";

let uploadView, filterView, postsController, registerView, editProfileView,
  forgotPasswordView, loginView, menuView,
  resetPasswordView, toastView, headerView, calenderView, template,
  postDetailView, deletePostPopupView, noConnectionPopupView,
  downLoadPopupView, fullImageView, deleteProfilePopupView;

function init() {
  initNoConnectionPopupElement();
  initElements();
  if (ConnectionHandler.isConnected()) {
    noConnectionPopupView.hideTopLayer();
    initController();
    initListener();
  } else {
    noConnectionPopupView.showNoConnectionPopup(Config
      .NO_INTERNET_CONNECTION_TITLE, Config.NO_INTERNET_CONNECTION_MSG);
  }
}

function initNoConnectionPopupElement() {
  noConnectionPopupView = new NoConnectionPopupView(document.querySelector(
    ".no-connection-popup"));
  initNoConnectionPopupListeners();
}

function initNoConnectionPopupListeners() {
  ConnectionHandler.addEventListener(Config.CONNECTION_HANDLER.EVENT.NOW_ONLINE,
    onNowOnline);
  ConnectionHandler.addEventListener(Config.CONNECTION_HANDLER.EVENT
    .NOW_OFFLINE, onNowOffline);
}

function onNowOnline() {
  noConnectionPopupView.hideTopLayer();
  noConnectionPopupView.reloadPostingBoard();
}

function onNowOffline() {
  noConnectionPopupView.showNoConnectionPopup(Config.CONNECTION_LOST_TITLE,
    Config.CONNECTION_LOST_MSG);
}

function initElements() {
  Shortcuts.init();
  template = document.getElementById("calender-template");
  uploadView = new UploadView(document.querySelector(".create-post"));
  filterView = new FilterView(document.querySelector(".filter-wrapper"));
  editProfileView = new EditProfileView(document.querySelector(
    ".popup.edit-profile"));
  forgotPasswordView = new ForgotPasswordView(document.querySelector(
    ".popup.forgot-password"));
  loginView = new LoginView(document.querySelector(".popup.login"));
  menuView = new MenuView(document.querySelector(".slide-menu"));
  registerView = new RegisterView(document.querySelector(".popup.register"));
  resetPasswordView = new ResetPasswordView(document.querySelector(
    ".popup.reset-password"));
  toastView = new ToastView(document.querySelector(".toast"));
  headerView = new HeaderView(document.querySelector(
    ".header"));
  calenderView = new CalenderView(template);
  postDetailView = new PostDetailView(document.querySelector(".detail-post"));
  deletePostPopupView = new DeletePostPopupView(document.querySelector(
    ".popup-delete-post"));
  downLoadPopupView = new DownloadPopupView(document.querySelector(
    ".popup-download-ics"));
  fullImageView = new FullImageView(document.querySelector(
    ".popup-post-image"));
  deleteProfilePopupView = new DeleteProfilePopupView(document.querySelector(
    ".popup-delete-profile"));
  // Adding the calender from template to the needed positions.
  filterView.setCalendar(calenderView.calendar);
  uploadView.setCalendar(calenderView.calendar);
}

function initController() {
  postsController = new PostsController(new PostViews(document.querySelector(
    ".post-wrapper")), new PostsModel());
}

function initListener() {
  // Database
  //Success-events provide change of the displayed information concerning posts/postingboard
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.APP_STARTED,
    fillPostsView);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.NEW_POST_STORED_IN_DB,
    onNewPostCreated);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.POST_DELETED_FROM_DB,
    onDeletePostFinal);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.POST_UPDATED_IN_DB,
    onPostUpdated);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.FAVOURISATION_FAILED,
    onFavourFailed);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.MORE_POSTS_IN_DB,
    onMorePostsInDB);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.POST_DELETED,
    onPostsDeleted);
  FirebaseDB.addEventListener(Config.FIREBASE_DB.EVENT.ERROR_ACTION,
    onErrorAction);
  // Image Compressor for uploading and saving in Database
  ImageCompressor.addEventListener(Config.IMAGE_COMPRESSOR.EVENT.ERROR_ACTION,
    onErrorAction);
  // User Authentication 
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.ERROR_ACTION, onErrorAction);
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.SUCCESS_ACTION,
    onSuccessAction);
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.PROFILE_DELETED,
    onProfileDeleted);
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.USER_SIGNED_IN,
    onUserSignedIn);
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.USER_SIGNED_OUT,
    onUserSignedOut);
  UserAuth.addEventListener(Config.USER_AUTH.EVENT.NEW_PASSWORD_REQUESTED,
    function() { resetPasswordView.changeVisibility(); });
  // Checking if inputs are correct
  InputChecker.addEventListener(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND,
    onInputErrorFound);
  InputChecker.addEventListener(Config.INPUT_CHECKER.EVENT.INPUT_DATA_CORRECT,
    onInputDataCorrect);
  // App header and popups for not logged-in users
  headerView.addEventListener(Config.HEADER_VIEW.EVENT.LOGIN_BUTTON_CLICKED,
    onLoginButtonClicked);
  headerView.addEventListener(Config.HEADER_VIEW.EVENT.LOGO_CLICKED,
    onLogoClicked);
  headerView.addEventListener(Config.HEADER_VIEW.EVENT.REGISTER_BUTTON_CLICKED,
    onRegisterButtonClicked);
  registerView.addEventListener(Config.REGISTER_VIEW.EVENT.REGISTER_CLICKED,
    onRegisterClicked);
  loginView.addEventListener(Config.LOGIN_VIEW.EVENT.LOGIN_BUTTON_CLICKED,
    onUserLogin);
  loginView.addEventListener(Config.LOGIN_VIEW.EVENT.PASSWORD_FORGOT_CLICKED,
    onOpenForgotPasswordPopup);
  forgotPasswordView.addEventListener(Config.FORGOT_PASSWORD_VIEW.EVENT
    .SEND_BUTTON_CLICKED, onSendButtonClicked);
  resetPasswordView.addEventListener(Config.RESET_PASSWORD_VIEW.EVENT
    .RESET_CLICKED, onResetClicked);
  // Menu and popups for logged-in users
  menuView.addEventListener(Config.MENU_VIEW.EVENT.LOGOUT_CLICKED,
    onUserLogout);
  menuView.addEventListener(Config.MENU_VIEW.EVENT.EDIT_PROFILE_CLICKED,
    onEditProfileClicked);
  menuView.addEventListener(Config.MENU_VIEW.EVENT.DELETE_PROFILE_CLICKED,
    onDeleteProfileClicked);
  menuView.addEventListener(Config.MENU_VIEW.EVENT.FILTER_BY_OWN_POSTS,
    onFilterByOwnPosts);
  menuView.addEventListener(Config.MENU_VIEW.EVENT.FILTER_BY_FAVOURISED,
    onFilterByFavourised);
  editProfileView.addEventListener(Config.EDIT_PROFILE_VIEW.EVENT
    .SAVE_BUTTON_CLICKED, onSaveClicked);
  deleteProfilePopupView.addEventListener(Config.DELETE_PROFILE_POPUP_VIEW.EVENT
    .DELETE_PROFILE_BUTTON_CLICKED,
    onDeleteProfileButtonClicked);
  // Filters
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.ADD_BUTTON_CLICKED,
    onAddButtonClicked);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.VERIFY_BUTTON_CLICKED,
    onVerifyButtonClicked);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.CATEGORY_CHOSEN,
    onCategoryChosen);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.FACULTY_CHOSEN,
    onFacultyChosen);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.ORDER_CHOSEN,
    onOrderChosen);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.RESET_FILTER_DATE,
    onResetFilterDate);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.RESET_FILTER_FACULTY,
    onResetFilterFaculty);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.RESET_FILTER_CATEGORY,
    onResetFilterCategory);
  filterView.addEventListener(Config.FILTER_VIEW.EVENT.RESET_FILTER_ORDER,
    onResetFilterOrder);
  // Filter calendar and calendar for upload
  calenderView.addEventListener(Config.CALENDAR_VIEW.EVENT.DATE_PICKED,
    onDatePicked);
  // Upload post
  uploadView.addEventListener(Config.UPLOAD_VIEW.EVENT.ENTER_START_DATE,
    onEnterStartDate);
  uploadView.addEventListener(Config.UPLOAD_VIEW.EVENT.ENTER_END_DATE,
    onEnterEndDate);
  uploadView.addEventListener(Config.UPLOAD_VIEW.EVENT.CLOSE_BUTTON_CLICKED,
    onCloseButtonClicked);
  uploadView.addEventListener(Config.UPLOAD_VIEW.EVENT.NEW_POST_CREATED,
    onNewPostStore);
  uploadView.addEventListener(Config.UPLOAD_VIEW.EVENT.STORE_EDITED_POST,
    onStoreEditedPost);
  // Post Controller
  postsController.addEventListener(Config.POSTS_CONTROLLER.EVENT.POST_CLICKED,
    onPostClicked);
  postsController.addEventListener(Config.POSTS_CONTROLLER.EVENT.REFRESH_POST,
    refreshPosts);
  // Post detail, edit, delete and download
  postDetailView.addEventListener(Config.POST_DETAIL_VIEW.EVENT.DELETE_POST,
    onDeletePost);
  postDetailView.addEventListener(Config.POST_DETAIL_VIEW.EVENT.EDIT_POST,
    onEditPost);
  postDetailView.addEventListener(Config.POST_DETAIL_VIEW.EVENT
    .FAVOURISED_BUTTON_CLICKED,
    onFavouriteButtonClicked);
  postDetailView.addEventListener(Config.POST_DETAIL_VIEW.EVENT.IMAGE_CLICKED,
    onImageClicked);
  postDetailView.addEventListener(Config.POST_DETAIL_VIEW.EVENT
    .DOWNLOAD_BUTTON_CLICKED,
    onDownloadButtonClicked);
  deletePostPopupView.addEventListener(Config.DELETE_POST_POPUP_VIEW.EVENT
    .DELETE_POST_FINAL,
    onDeletePostButtonClicked);
  downLoadPopupView.addEventListener(Config.DOWNLOAD_POPUP_VIEW.EVENT
    .EMAIL_SENT, onEmailSent);
}

/**
 * DATABASE 
 */
function fillPostsView(event) {
  menuView.resetMenuFilters();
  resetValues();
  headerView.setInfoText(Config.HEADER_VIEW.HEADER_ALL_POSTS);
  postsController.initialPosts(event.data);
  postsController.hideLoadSpinner();
}

function resetValues() {
  calenderView.resetCalenders();
  filterView.resetFilter();
  postsController.resetValues();
}

function onNewPostCreated(event) {
  postsController.storePost(event.data);
  Shortcuts.toggleClickable();
  uploadView.onCloseButtonClicked();
}

function onDeletePostFinal(event) {
  postsController.deletePost(event.data);
  deletePostPopupView.hideMiddleLayer();
  postDetailView.hide();
}

function onPostUpdated(event) {
  let newPost = event.data;
  postsController.storePostAtIndexOfEditedPost(newPost);
  postDetailView.fillPostDetailView(newPost);
  Shortcuts.toggleClickable();
  postDetailView.showDetailView(newPost, UserAuth.getCurrentUser());
  uploadView.onCloseButtonClicked();
}

function onFavourFailed(event) {
  postDetailView.toggleFavouriteActive();
  postsController.favourisePost(event.data, UserAuth.getUserId(), postDetailView
    .buttons.favourite.classList.contains("active"), menuView
    .getIsFilterFavouritesChecked());
  toastView.setText(Config.DB_FAV_ERROR);
  toastView.showError();
}

function onMorePostsInDB() {
  postsController.showMorePostsButton();
}

function onPostsDeleted() {
  postsController.onMorePostsButtonClicked();
}
/**
 * USER AUTHENTICATION / IMAGE COMPRESSOR / DATABASE
 */
function onErrorAction(event) {
  let message = event.data.message;
  if (message === Config.DB_ADD_ERROR) {
    Shortcuts.toggleClickable();
    uploadView.onCloseButtonClicked();
  }
  if (message === Config.FIREBASE_DB.DB_POSTS_DELETION_FAIL) {
    postsController.hideLoadSpinner();
  }
  switch (event.data.action) {
    case Config.USER_AUTH.ACTION.VERIFY_EMAIL_NOT_SENT:
      postsController.hideLoadSpinner();
      filterView.setVerifyInfoText(
        "Verifiziere dein Profil, um Postings hochladen zu können.");
      filterView.showVerifyInfoButton();
      filterView.showVerifyInfo();
      break;
    case Config.USER_AUTH.ACTION.UPDATE_PROFILE_ERROR:
      editProfileView.hideMiddleLayer();
      break;
    default:
      //
  }
  //In case of user error
  toastView.setText(message);
  toastView.showError();
}

function onSuccessAction(event) {
  if (event.data.message !== undefined) {
    toastView.setText(event.data.message);
    toastView.showSuccess();
  }
  switch (event.data.action) {
    case Config.USER_AUTH.ACTION.LOGIN_USER:
      loginView.resetFields();
      loginView.changeVisibility();
      break;
    case Config.USER_AUTH.ACTION.REGISTER_USER:
      registerView.hide();
      postsController.showLoadSpinner();
      UserAuth.sendVerificationEmail();
      break;
    case Config.USER_AUTH.ACTION.RESET_PASSWORD:
      // Clean URL without reloading page
      // From https://stackoverflow.com/questions/22753052/remove-url-parameters-without-refreshing-page
      window.history.replaceState({}, document.title, "/app");
      break;
    case Config.USER_AUTH.ACTION.VERIFY_EMAIL_SENT:
      postsController.hideLoadSpinner();
      filterView.setVerifyInfoText("Bitte prüfe dein E-Mail Postfach.");
      filterView.hideVerifyInfoButton();
      break;
    case Config.USER_AUTH.ACTION.UPDATE_USERNAME:
      menuView.setUsername(event.data.fieldData);
      break;
    case Config.USER_AUTH.ACTION.UPDATE_EMAIL:
      menuView.setEmail(event.data.fieldData);
      break;
    case Config.USER_AUTH.ACTION.VERIFIED_EMAIL: { 
      let user = UserAuth.getCurrentUser();
      if (user) {
        filterView.showAddButton();
        filterView.hideVerifyInfo();
      } else {
        filterView.hideAddButton();
        filterView.hideVerifyInfo();
      }
      break;
    }
    default:
      // default
  }
}

function onProfileDeleted(event) {
  postsController.showLoadSpinner();
  FirebaseDB.deleteUserActions(event.data);
}

// State when a user is currently logged-in
function onUserSignedIn(event) {
  let userInfo = event.data;
  // Hide Header Buttons
  headerView.hideButtons();
  menuView.showMenuIcon();
  // Only show add-button if user is verified
  if (userInfo.emailVerified) {
    filterView.showAddButton();
    filterView.hideVerifyInfo();
  } else {
    filterView.hideAddButton();
    filterView.showVerifyInfoButton();
    filterView.showVerifyInfo();
  }
  // Update userinfo in menu when user is signed-in
  if (userInfo !== undefined) {
    if (userInfo.displayName !== null && userInfo.email !== null) {
      let username = userInfo.displayName;
      menuView.setUserInfo(username, userInfo.email);
      postDetailView.setIsUserLoggedIn(true);
    }
  }
}

// State when a user is currently logged-out
function onUserSignedOut() {
  headerView.showButtons();
  filterView.hideAddButton();
  filterView.hideVerifyInfo();
  menuView.hideMenuIcon();  
  menuView.hideMenu();
  headerView.setInfoText(Config.HEADER_VIEW.HEADER_ALL_POSTS);
  postDetailView.setIsUserLoggedIn(false);
}

function onInputErrorFound(event) {
  let parentForm = document.querySelector(".popup:not(.hidden)"),
    message = event.data.message,
    errorPopup;
  //detects the popup with an input error  
  if (editProfileView.el === parentForm) {
    errorPopup = editProfileView;
  } else if (resetPasswordView.el === parentForm) {
    errorPopup = resetPasswordView;
  } else if (forgotPasswordView.el === parentForm) {
    errorPopup = forgotPasswordView;
  } else {
    errorPopup = registerView;
  }
  //depending on error field warning is set 
  switch (event.data.field) {
    case "username": {
      errorPopup.setUsernameWarning(message);
    }
    break;
  case "email": {
    errorPopup.setEmailWarning(message);
  }
  break;
  case "password": {
    errorPopup.setPasswordWarning(message);
  }
  break;
  default:
    // 
  }
}

/**
 * INPUT CHECKER
 */
function onInputDataCorrect(changedInfo) {
  let currentUser = UserAuth.getCurrentUser(),
    username = changedInfo.data.username,
    email = changedInfo.data.email,
    password = changedInfo.data.password;
  if (currentUser !== null) {
    if (password !== undefined) {
      UserAuth.updatePassword(password);
    }
    if (email !== undefined) {
      UserAuth.updateEmail(email);
    }
    if (username !== undefined) {
      UserAuth.updateUsername(username);
    }
    if ((username === undefined || username !== "") && (email === undefined ||
        email !== "") && (password === undefined || password !== "")) {
      editProfileView.hideMiddleLayer();
      editProfileView.resetFields();
    }
  } else {
    UserAuth.registerUser(username, email, password);
    menuView.setUsername(username);
    menuView.setEmail(email);
  }
}

/**
 * APP HEADER AND POPUPS FOR NOT LOGGED-IN USERS
 */
function onLoginButtonClicked() {
  loginView.insertEmailFromCookie(CookieManager.getLoginEmailCookie());
  loginView.changeVisibility();
}

// Sets app to its initial state
function onLogoClicked() {
  postsController.onMorePostsButtonClicked();
}

function onRegisterButtonClicked() {
  registerView.changeVisibility();
}

// Try to register a user
function onRegisterClicked() {
  // Get data from inputs
  let username = registerView.usernameField.value,
    email = registerView.emailField.value,
    password = registerView.passwordField.value;
  InputChecker.checkAllChanged({
    username: username,
    email: email,
    password: password,
  });
}

function onUserLogin() {
  // Get data from inputs
  let email = loginView.emailField.value,
    password = loginView.passwordField.value;
  UserAuth.loginUser(email, password);
  CookieManager.setDownloadEmailCookie(email);
  CookieManager.setLoginEmailCookie(email);
  downLoadPopupView.setEmail(CookieManager.getEmailCookieValue());
}

function onOpenForgotPasswordPopup() {
  loginView.changeVisibility();
  loginView.resetFields();
  forgotPasswordView.changeVisibility();
}

// Reference for Async/Await: https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8
async function onSendButtonClicked(event) {
  if (InputChecker.isValidEmail(event.data)) {
    await UserAuth.isUser(event.data);
    if (UserAuth.userExists === true) {
      UserAuth.sendResetPasswordMail(event.data);
      forgotPasswordView.resetFields();
      forgotPasswordView.changeVisibility();
    }
  }
}

function onResetClicked(event) {
  if (InputChecker.isValidPassword(event.data)) {
    UserAuth.resetPassword(event.data);
    resetPasswordView.resetFields();
    resetPasswordView.changeVisibility();
  }
}

/**
 * MENU AND POPUPS FOR LOGGED-IN USERS
 */
function onUserLogout() {
  UserAuth.logoutUser();
  menuView.hideMenuIcon();
  menuView.resetMenuFilters();
  postsController.onMorePostsButtonClicked();
  CookieManager.resetDownloadEmailCookie();
}

function onEditProfileClicked() {
  let user = UserAuth.getCurrentUser();
  editProfileView.updateFields(user.displayName, user.email);
  editProfileView.showMiddleLayer();
}

function onDeleteProfileClicked() {
  deleteProfilePopupView.showMiddleLayer();
}

function onFilterByOwnPosts(event) {
  let isChosen = event.data;
  changePostsInfoText(isChosen, Config.HEADER_VIEW.HEADER_YOUR_POSTS);
  postsController.sortByOwnPosts(isChosen, UserAuth.getUserId());
}

function onFilterByFavourised(event) {
  let isChosen = event.data;
  changePostsInfoText(isChosen, Config.HEADER_VIEW.HEADER_YOUR_FAVOURITES);
  postsController.sortByFavourites(isChosen, UserAuth.getUserId());
}

function changePostsInfoText(bool, text) {
  if (bool) {
    headerView.setInfoText(text);
  } else {
    headerView.setInfoText(Config.HEADER_VIEW.HEADER_ALL_POSTS);
  }
}

function onSaveClicked() {
  let user = UserAuth.getCurrentUser(),
    username = user.displayName,
    email = user.email,
    newUsername, newEmail, newPassword, newPasswordRepeat;
  // Check if info changed
  // If changed, set values to variable
  if (username !== editProfileView.usernameField.value) {
    newUsername = editProfileView.usernameField.value;
    if (InputChecker.isValidUsername(newUsername)) {
      editProfileView.removeWarnings();
      UserAuth.updateUsername(newUsername);
    }
  }
  if (email !== editProfileView.emailField.value) {
    newEmail = editProfileView.emailField.value;
    if (InputChecker.isValidEmail(newEmail)) {
      editProfileView.resetFields();
      UserAuth.updateEmail(newEmail);
    }
  }
  if (editProfileView.checkbox.checked) {
    newPassword = editProfileView.passwordFieldNew.value;
    newPasswordRepeat = editProfileView.passwordFieldNewRepeat.value;
    if (newPassword.length > 0 && newPasswordRepeat.length > 0) {
      if (InputChecker.isSamePassword(newPassword, newPasswordRepeat)) {
        if (InputChecker.isValidPassword(newPassword)) {
          editProfileView.resetFields();
          UserAuth.updatePassword(newPassword);
        }
      }
    }
  }
}

function onDeleteProfileButtonClicked() {
  deleteProfilePopupView.hideMiddleLayer();
  UserAuth.deleteUser();
  menuView.toggleMenu();
}

/**
 * FILTERS
 */
function onAddButtonClicked() {
  // Only verified users can upload a post
  let user = UserAuth.getCurrentUser();
  if (user.emailVerified) {
    uploadView.changeVisibility();
    uploadView.setUserId(UserAuth.getUserId());
    uploadView.toggleEditMode(false, undefined);
    calenderView.resetCalenders();
  }
}

function onVerifyButtonClicked() {
  postsController.showLoadSpinner();
  UserAuth.sendVerificationEmail();
}

function onCategoryChosen(event) {
  postsController.sortByCategory(event.data);
}

function onFacultyChosen(event) {
  postsController.sortByFaculty(event.data);
}

function onOrderChosen(event) {
  postsController.sortByOrder(event.data);
}

function onResetFilterDate() {
  postsController.sortByDate(Config.ALL_DATES);
}

function onResetFilterFaculty() {
  postsController.sortByFaculty(Config.ALL_FACULTIES);
}

function onResetFilterCategory() {
  postsController.sortByCategory(Config.ALL_CATEGORIES);
}

function onResetFilterOrder() {
  postsController.sortByOrder(Config.ORIGINAL_ORDER);
}

/**
 * FILTER CALENDAR AND CALENDAR UPLOAD DATEPICKER
 */

/**
 * Processes picked date from used calendar and sets the picked date 
 * at the needed position
 */
function onDatePicked(event) {
  let parent = event.data.parent,
    date = event.data.date;
  if (parent === filterView.datePickerWrapper) {
    filterView.setDate(date);
    postsController.sortByDate(date);
  } else if (parent === uploadView.elements.startDateWrapper) {
    uploadView.setStartDate(date);
    calenderView.setStartDate(date);
  } else if (parent === uploadView.elements.endDateWrapper) {
    uploadView.setEndDate(date);
    calenderView.setEndDate(date);
  }
}

/**
 * POST UPLOAD
 */

function onEnterStartDate() {
  calenderView.formatStartDatePicker();
}

function onEnterEndDate() {
  calenderView.formatEndDatePicker();
}

function onCloseButtonClicked(event) {
  let isEditMode = event.data.isEditMode,
    post = event.data.post;
  calenderView.resetCalenders();
  if (isEditMode) {
    postDetailView.showDetailView(post, UserAuth.getCurrentUser());
  }
}

function onNewPostStore(event) {
  Shortcuts.toggleClickable();
  FirebaseDB.writePostData(event.data, true);
}

function onStoreEditedPost(event) {
  Shortcuts.toggleClickable();
  FirebaseDB.writePostData(event.data, false);
}

/**
 * POST CONTROLLER
 */
function onPostClicked(event) {
  let post = event.data;
  postDetailView.fillPostDetailView(post);
  postDetailView.showDetailView(post, UserAuth.getCurrentUser());
}

function refreshPosts() {
  FirebaseDB.initPosts();
}

/**
 * POST DETAIL, EDIT, DELETE AND DOWNLOAD
 */
function onDeletePost() {
  deletePostPopupView.showMiddleLayer();
}

function onEditPost(event) {
  let clickedPost = event.data,
    startDate = clickedPost.start,
    endDate = clickedPost.end;
  postDetailView.hide();
  uploadView.setUserId(UserAuth.getUserId());
  uploadView.fillUploadView(clickedPost);
  uploadView.setStartDate(startDate);
  uploadView.setEndDate(endDate);
  uploadView.toggleEditMode(true, clickedPost);
  uploadView.changeVisibility();
  calenderView.setStartDate(startDate);
  calenderView.setEndDate(endDate);
}

function onFavouriteButtonClicked(event) {
  let isFavourised = event.data.favourite,
    favourisedPost = event.data.post;
  postsController.favourisePost(favourisedPost, UserAuth.getUserId(),
    isFavourised, menuView.getIsFilterFavouritesChecked());
  FirebaseDB.favourPost(favourisedPost);
}

function onImageClicked(event) {
  fullImageView.setImage(event.data);
  fullImageView.showMiddleLayer();
}

function onDownloadButtonClicked(event) {
  let openPost = event.data;
  downLoadPopupView.setEmail(CookieManager.getEmailCookieValue());
  downLoadPopupView.showDownloadPopup();
  downLoadPopupView.setDataForICSFile(openPost);
}

function onDeletePostButtonClicked() {
  FirebaseDB.deletePost(postDetailView.getIdFromClickedPost());
}

function onEmailSent(event) {
  CookieManager.setDownloadEmailCookie(event.data.insertedEmail);
}

init();