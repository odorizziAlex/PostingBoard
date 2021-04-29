/* eslint-env browser */
import PopupView from "./PopupView.js";
import { Event } from "../utils/Observable.js";
import DateChecker from "../utils/DateChecker.js";
import Config from "../utils/Config.js";

/**
 * DESCRIPTION: The PostDetailView is the popup you can see, if you click on a post.
 * It shows all Informations about the post. Clicking on the picture opens the image for a more detailled
 * look. Furthermore, there are three different appearances of this popup:
 * 1. If you created the post you just clicked on,
 * you have the possibility to edit or delete this post. You can also see, how many users
 * favourized your post. 
 * 2. If you don't own the post you clicked on, you can favourize it and you have the ability 
 * to send an .ics file with the post's information. 
 * 3. If you aren't logged in, you have the possibility to send an .ics file and see how many favourizations 
 * the post has. But you can't favourize the post without signing in.
 */

let isLoggedIn = false;

function initElements(view) {
  view.buttons = {
    closeButton: view.el.querySelector(".detail-post-close"),
    editDeleteWrapper: view.el.querySelector(".wrapper-edit-post"),
    editButton: view.el.querySelector(".edit"),
    deleteButton: view.el.querySelector(".delete"),
    downloadButton: view.el.querySelector(".action-wrapper .download"),
    favourite: view.el.querySelector(".favourite-checkbox"),
  };
  view.elements = {
    image: view.el.querySelector(".detail-post-image").firstElementChild,
    fromDate: view.el.querySelector(".detail-post-from"),
    toDate: view.el.querySelector(".detail-view-to"),
    title: view.el.querySelector(".detail-post-title"),
    category: view.el.querySelector(".detail-post-category"),
    facultyName: view.el.querySelector(".faculty-name"),
    facultyColor: view.el.querySelector(".faculty-color"),
    actionWrapper: view.el.querySelector(".action-wrapper"),
    favNumber: view.el.querySelector(".detail-fav-number"),
    favWrapper: view.el.querySelector(".favourite-wrapper"),
  };
  initListeners(view);
}

function initListeners(view) {
  view.buttons.closeButton.addEventListener("click", onCloseButtonClicked
    .bind(view));
  view.buttons.editButton.addEventListener("click", onEditButtonClicked
    .bind(view));
  view.buttons.deleteButton.addEventListener("click", onDeleteButtonClicked
    .bind(view));
  view.buttons.downloadButton.addEventListener("click", onDownloadButtonClicked
    .bind(view));
  view.buttons.favourite.addEventListener("click", onFavouriteButtonClicked
    .bind(view));
  view.elements.image.addEventListener("click", onImageClicked.bind(view));
}

/**
 * Informs all listeners for this event, and sends, if favourized and the post with the event.
 */
function onFavouriteButtonClicked() {
  this.toggleFavouriteActive();
  let isFavoured = this.buttons.favourite.classList.contains("active");
  this.notifyAll(new Event(Config.POST_DETAIL_VIEW.EVENT
    .FAVOURISED_BUTTON_CLICKED, {
      favourite: isFavoured,
      post: this.openPost,
    }));
}

function onDownloadButtonClicked() {
  this.notifyAll(new Event(Config.POST_DETAIL_VIEW.EVENT
    .DOWNLOAD_BUTTON_CLICKED, this.openPost));
}

/*
 * Checking if the clicked post is created by the current user.
 * This uses the user Id from Current user and the user id from the given post
 */
function isPostOwner(post, currentUser) {
  if (currentUser === null) {
    return false;
  }
  let userIdFromPost = post.userId,
    currentUserId = currentUser.uid;
  if (userIdFromPost === currentUserId) {
    return true;
  }
  return false;
}

/**
 * Checks if the current user has marked the current post as favourite before.
 * Either way it will be toggled to the opposite.
 * @param {*} view the detail popup
 * @param {*} isFavouriteList the list of favourizations of the post
 * @param {*} currentUser the current user's id
 */
function checkIfMarkedFavourite(view, isFavouriteList, currentUser) {
  if (isFavouriteList === [] || currentUser === null) {
    return;
  }
  if (isFavouriteList.includes(currentUser.uid)) {
    activateFavouriteButton(view);
  } else {
    deactivateFavouriteButton(view);
  }
}

// Callbacks
function onEditButtonClicked() {
  this.notifyAll(new Event(Config.POST_DETAIL_VIEW.EVENT.EDIT_POST, this
    .openPost));
}

function onDeleteButtonClicked() {
  this.notifyAll(new Event(Config.POST_DETAIL_VIEW.EVENT.DELETE_POST));
}

function onCloseButtonClicked() {
  this.hide();
}

function onImageClicked(event) {
  // event.target.src is the source link from the image from the post
  this.notifyAll(new Event(Config.POST_DETAIL_VIEW.EVENT.IMAGE_CLICKED, event
    .target.src));
}

/**
 * Activation an deactivation of favourize post button
 * @param {*} wrapper the class
 */
function activateFavouriteButton(wrapper) {
  wrapper.buttons.favourite.classList.add("active");
}

function deactivateFavouriteButton(wrapper) {
  wrapper.buttons.favourite.classList.remove("active");
}

class PostDetailView extends PopupView {

  constructor(el) {
    super(el);
    this.openPost = undefined;
    initElements(this);
  }

  setIsUserLoggedIn(status) {
    isLoggedIn = status;
  }

  /**
   * Activation of favourized and in-/decreasing the number of favourizations for this post.
   */
  toggleFavouriteActive() {
    let isFavoured = this.buttons.favourite.classList.toggle("active"),
      favouredNum;
    if (isFavoured) {
      favouredNum = this.openPost.favourites.length + 1;
    } else {
      favouredNum = this.openPost.favourites.length - 1;
    }
    if (favouredNum >= Config.POST_DETAIL_VIEW.MAX_FAVOUR_NUM) {
      this.elements.favNumber.innerHTML = Config.POST_DETAIL_VIEW
        .OVER_FAVOUR_MAX;
    } else {
      this.elements.favNumber.innerHTML = favouredNum;
    }
  }

  /*
   */

  /**
   * If the current user is logged in and owns the post, he just clicked, he can edit/delete the post.
   * If the current user is logged in and doesn't own the post, he can favourize it or send it.
   * If the current user isn't logged in, he can send it and sees how many likes there are.
   * @param {*} post clicked post 
   * @param {*} currentUser currently logged in user
   */
  showDetailView(post, currentUser) {
    if (isPostOwner(post, currentUser) && isLoggedIn) {
      this.buttons.editDeleteWrapper.classList.remove("hidden");
      this.buttons.favourite.classList.add("disable");
      this.buttons.downloadButton.classList.add("hidden");
      this.elements.favWrapper.classList.add("bottom");
    } else if (!isPostOwner(post, currentUser) && isLoggedIn) {
      this.buttons.editDeleteWrapper.classList.add("hidden");
      this.elements.favWrapper.classList.remove("bottom");
      this.buttons.downloadButton.classList.remove("hidden");
      this.buttons.favourite.classList.remove("disable");
    } else if (!isLoggedIn) {
      this.elements.favWrapper.classList.remove("bottom");
      this.buttons.downloadButton.classList.remove("hidden");
      this.buttons.favourite.classList.add("disable");
      this.buttons.editDeleteWrapper.classList.add("hidden");
    }
    checkIfMarkedFavourite(this, post.favourites, currentUser);
    this.show();
  }

  /**
   * Fills the Detail popup.
   * @param {*} post clicked post
   */
  fillPostDetailView(post) {
    this.openPost = post;
    let file = post.file,
      favouredNum = post.favourites.length;
    if (file !== undefined) {
      this.elements.image.src = URL.createObjectURL(post.file);
    } else {
      this.elements.image.src = Config.POST_VIEWS.DEFAULT_IMAGE_PATH;
    }
    this.elements.fromDate.innerHTML = DateChecker.getGermanDateFormat(post
      .start);
    this.elements.toDate.innerHTML = DateChecker.getGermanDateFormat(post
      .end);
    this.elements.title.innerHTML = post.title;
    this.elements.category.innerHTML = post.category;
    this.elements.facultyName.innerHTML = post.faculty;
    this.elements.facultyColor.style.background = Config.POST_DETAIL_VIEW
      .FACULTY_COLORS[post
        .faculty];
    if (favouredNum >= Config.POST_DETAIL_VIEW.MAX_FAVOUR_NUM) {
      favouredNum = Config.POST_DETAIL_VIEW.OVER_FAVOUR_MAX;
    }
    this.elements.favNumber.innerHTML = favouredNum;
  }

  getIdFromClickedPost() {
    return this.openPost.id;
  }
}

export default PostDetailView;