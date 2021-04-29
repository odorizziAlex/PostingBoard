/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import Config from "../utils/Config.js";
import Post from "../utils/Post.js";
import PopupView from "./PopupView.js";
import DateChecker from "../utils/DateChecker.js";
import ImageCompressor from "../utils/ImageCompressor.js";

var file,
  calendar,
  userId, startDate, endDate,
  isEditMode, postToEdit;

//checks if all necessary values to store/update a post are chosen/filled. If not -> warnings are shown. If all values chosen/filled -> store/update posts
function onStoreButtonClicked() {
  let isStorable = true,
    post;
  if (file === undefined) {
    this.elements.upload.nextElementSibling.innerHTML = Config.UPLOAD_VIEW
      .FILE_WARNING;
    isStorable = false;
  } else {
    this.elements.upload.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  }
  if (this.elements.facultyButton.innerHTML === Config.UPLOAD_VIEW
    .FACULTY_TEXT) {
    this.elements.facultyButton.nextElementSibling.innerHTML = Config
      .UPLOAD_VIEW
      .FACULTY_WARNING;
    isStorable = false;
  } else {
    this.elements.facultyButton.nextElementSibling.innerHTML = Config
      .EMPTY_STRING;
  }
  if (this.elements.categoryButton.innerHTML === Config.UPLOAD_VIEW
    .CATEGORY_TEXT) {
    this.elements.categoryButton.nextElementSibling.innerHTML = Config
      .UPLOAD_VIEW
      .CATEGORY_WARNING;
    isStorable = false;
  } else {
    this.elements.categoryButton.nextElementSibling.innerHTML = Config
      .EMPTY_STRING;
  }
  if (this.elements.title.value === Config.EMPTY_STRING) {
    this.elements.title.nextElementSibling.innerHTML = Config.UPLOAD_VIEW
      .TITLE_WARNING;
    isStorable = false;
  } else {
    this.elements.title.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  }
  if (this.elements.startButton.innerHTML === Config.UPLOAD_VIEW
    .START_DATE_BUTTON_TEXT ||
    this.elements.endButton.innerHTML === Config.UPLOAD_VIEW
    .END_DATE_BUTTON_TEXT) {
    this.elements.datePickerWarning.innerHTML = Config.UPLOAD_VIEW.TIME_WARNING;
    isStorable = false;
  } else {
    this.elements.datePickerWarning.innerHTML = Config.EMPTY_STRING;
  }
  if (isStorable) {
    this.elements.loadSpinner.classList.remove("hidden");
    post = new Post(this.elements.title.value, startDate, endDate, this
      .elements
      .categoryButton.innerHTML, this.elements.facultyButton.innerHTML,
      file, userId);

    if (isEditMode) {
      post.favourites = postToEdit.favourites;
      post.id = postToEdit.id;
      this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.STORE_EDITED_POST,
        post));
    } else {
      this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.NEW_POST_CREATED,
      post));
    }
  }
}

//resets all values and removes the warnings
function resetValues(wrapper) {
  wrapper.elements.facultyButton.innerHTML = Config.UPLOAD_VIEW.FACULTY_TEXT;
  wrapper.elements.categoryButton.innerHTML = Config.UPLOAD_VIEW.CATEGORY_TEXT;
  wrapper.elements.title.value = Config.EMPTY_STRING;
  wrapper.elements.startButton.innerHTML = Config.UPLOAD_VIEW
    .START_DATE_BUTTON_TEXT;
  wrapper.elements.endButton.innerHTML = Config.UPLOAD_VIEW
  .END_DATE_BUTTON_TEXT;
  wrapper.elements.image.style.background = Config.UPLOAD_VIEW
    .IMAGE_FIELD_DEFAULT_BACKGROUND;
  wrapper.elements.loadSpinner.classList.add("hidden");
  file = undefined;
  userId = undefined;
  removeWarnings(wrapper);
}

//Following 2 functions set the chosen category/faculty
function onCategoryChosen(event) {
  let category = event.target;
  //Prevents chosing all categories at once on moving a pressed mouse over list elements
  if (category !== this.elements.categoryDropDown) {
    this.elements.categoryButton.innerHTML = category.innerHTML;
  }
}

function onFacultyChosen(event) {
  let faculty = event.target;
  //Prevents chosing all faculties at once on moving a pressed mouse over list elements
  if (faculty !== this.elements.facultyDropDown) {
    this.elements.facultyButton.innerHTML = faculty.innerHTML;
  }
}

function onImageDropped(event) {
  //File will not load in browser
  event.preventDefault();
  //Ensures that drop-down occurs only in intended field
  if (event.target === this.elements.image || this.elements.image.contains(
      event.target)) {
    setFile(this, event.dataTransfer.files[0]);
  }
}

function onImageSelectionStarted() {
  this.elements.upload.click();
}

function onFileSelected() {
  setFile(this, this.elements.upload.files[0]);
}

//Following 4 are used to append or remove calender under hover buttons
function onMouseEnterStartDate() {
  this.elements.startDateWrapper.appendChild(calendar);
  this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.ENTER_START_DATE));
}

function onMouseLeaveStartDate() {
  this.elements.startDateWrapper.removeChild(calendar);
  this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.LEAVE_START_DATE));
}

function onMouseEnterEndDate() {
  this.elements.endDateWrapper.appendChild(calendar);
  this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.ENTER_END_DATE));
}

function onMouseLeaveEndDate() {
  this.elements.endDateWrapper.removeChild(calendar);
  this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.LEAVE_END_DATE));
}

function initUploadView(wrapper) {
  wrapper.elements = {
    windowTitle: wrapper.el.querySelector(".upload-popup-title"),
    title: wrapper.el.querySelector(".input-title"),
    datePickerWarning: wrapper.el.querySelector(".date-picker")
      .lastElementChild,
    startDateOutterWrapper: wrapper.el.querySelector("#from"),
    endDateOutterWrapper: wrapper.el.querySelector("#to"),
    startButton: wrapper.el.querySelector("#from").firstElementChild,
    endButton: wrapper.el.querySelector("#to").firstElementChild,
    startDateWrapper: wrapper.el.querySelector(".date-from"),
    endDateWrapper: wrapper.el.querySelector(".date-to"),
    categoryButton: wrapper.el.querySelector(".category").firstElementChild,
    categoryDropDown: wrapper.el.querySelector(".category").lastElementChild,
    facultyButton: wrapper.el.querySelector(".faculty").firstElementChild,
    facultyDropDown: wrapper.el.querySelector(".faculty").lastElementChild,
    image: wrapper.el.querySelector(".image-field"),
    selectButton: wrapper.el.querySelector("#uploader"),
    upload: wrapper.el.querySelector(".upload"),
    closeButton: wrapper.el.querySelector(".close"),
    storeButton: wrapper.el.querySelector(".button.highlight"),
    loadSpinner: wrapper.el.querySelector(".while-upload-overlay"),
  };
  wrapper.elements.title.value = Config.EMPTY_STRING;
  initListeners(wrapper);
}

function initListeners(wrapper) {
  wrapper.elements.categoryDropDown.addEventListener("click", onCategoryChosen
    .bind(wrapper));
  wrapper.elements.facultyDropDown.addEventListener("click", onFacultyChosen
    .bind(wrapper));
  wrapper.elements.selectButton.addEventListener("click",
    onImageSelectionStarted.bind(wrapper));
  wrapper.elements.closeButton.addEventListener("click", wrapper
    .onCloseButtonClicked.bind(wrapper));
  wrapper.elements.storeButton.addEventListener("click", onStoreButtonClicked
    .bind(wrapper));
  wrapper.elements.upload.addEventListener("change", onFileSelected
    .bind(wrapper));
  wrapper.elements.startDateOutterWrapper.addEventListener("mouseenter",
    onMouseEnterStartDate.bind(wrapper));
  wrapper.elements.startDateOutterWrapper.addEventListener("mouseleave",
    onMouseLeaveStartDate.bind(wrapper));
  wrapper.elements.endDateOutterWrapper.addEventListener("mouseenter",
    onMouseEnterEndDate.bind(wrapper));
  wrapper.elements.endDateOutterWrapper.addEventListener("mouseleave",
    onMouseLeaveEndDate.bind(wrapper));
  //dropping image file on image field is possible  
  window.addEventListener("drop", onImageDropped.bind(wrapper));
  window.addEventListener("dragover", function(event) {
    //File will not load in browser
    event.preventDefault();
  });
}

//removes warnings by setting their text to empty string
function removeWarnings(wrapper) {
  wrapper.elements.facultyButton.nextElementSibling.innerHTML = Config
    .EMPTY_STRING;
  wrapper.elements.categoryButton.nextElementSibling.innerHTML = Config
    .EMPTY_STRING;
  wrapper.elements.title.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  wrapper.elements.upload.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  wrapper.elements.datePickerWarning.innerHTML = Config.EMPTY_STRING;
}

//sets file depending on chosen image
async function setFile(wrapper, data) {
  if (data && Config.UPLOAD_VIEW.FILE_TYPES.includes(data.type)) {
    //image is png or jpeg
    file = await ImageCompressor.compressImage(data);
    wrapper.elements.upload.nextElementSibling.innerHTML = Config
    .EMPTY_STRING;
    //sets preview
    setBackgroundPreview(wrapper);
  } else {
    //wrong file type
    wrapper.elements.upload.nextElementSibling.innerHTML = Config.UPLOAD_VIEW
      .FILE_WARNING;
    wrapper.elements.image.style.background = Config.UPLOAD_VIEW
      .IMAGE_FIELD_DEFAULT_BACKGROUND;
    file = undefined;
  }
}

//sets background of image field to inform user, which image is going to be stored, if user presses store button
function setBackgroundPreview(wrapper) {
  wrapper.elements.image.style.background = Config.UPLOAD_VIEW
    .IMAGE_FIELD_AFTER_BACKGROUND + URL.createObjectURL(file) + Config
    .UPLOAD_VIEW.CLOSE_BRACKETS;
}

//sets title depending on state of app (updating or storing new post)
function adjustTitle(wrapper) {
  if (isEditMode) {
    wrapper.elements.windowTitle.innerHTML = Config.UPLOAD_VIEW.EDIT_MODE_TITLE;
  } else {
    wrapper.elements.windowTitle.innerHTML = Config.UPLOAD_VIEW
      .UPLOAD_MODE_TITLE;
  }
}

//represents view and logic to upload and update posts
class UploadView extends PopupView {

  constructor(el) {
    super(el);
    initUploadView(this);
  }

  //fills uploadview, in case user wants to update his own post
  fillUploadView(post) {
    this.elements.title.value = post.title;
    this.setStartDate(post.start);
    this.setEndDate(post.end);
    this.elements.categoryButton.innerHTML = post.category;
    this.elements.facultyButton.innerHTML = post.faculty;
    file = post.file;
    setBackgroundPreview(this);
  }

  //true, post is not undefined, in case user wants to update. user wants to store new post -> false, post = undefined
  toggleEditMode(isEdit, post) {
    isEditMode = isEdit;
    postToEdit = post;
    adjustTitle(this);
  }

  onCloseButtonClicked() {
    resetValues(this);
    this.changeVisibility();
    this.notifyAll(new Event(Config.UPLOAD_VIEW.EVENT.CLOSE_BUTTON_CLICKED, {
      isEditMode: isEditMode,
      post: postToEdit,
    }));
  }

  //sets start date, if user wants to update
  setStartDate(date) {
    startDate = date;
    this.elements.startButton.innerHTML = DateChecker.getGermanDateFormat(
      date);
  }

  //sets end date, if user wants to update
  setEndDate(date) {
    endDate = date;
    this.elements.endButton.innerHTML = DateChecker.getGermanDateFormat(date);
  }

  setCalendar(cal) {
    calendar = cal;
  }

  //update and new post
  setUserId(id) {
    userId = id;
  }
}

export default UploadView;