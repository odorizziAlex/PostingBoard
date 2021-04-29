/* eslint-env browser */
import PopupView from "./PopupView.js";
import { Event } from "../utils/Observable.js";
import Config from "../utils/Config.js";

/**
 * DESCRIPTION: This class is for preparing the post data, to be sent as an .ics file 
 * via nodemailer in the AppServer.js class.
 * All the needed information for the .ics file get stored in the html placeholders,
 * so the AppServer.js class can read out the needed information to create the file
 * and send it.
 */

let email;

function initElements(wrapper) {
  wrapper.closeButton = wrapper.el.querySelector(".close");
  wrapper.emailInput = wrapper.el.querySelector(".email");
  wrapper.sendMailButton = wrapper.el.querySelector(".send-email");
  initListeners(wrapper);
}

function initListeners(wrapper) {
  wrapper.closeButton.addEventListener("click", onCloseButtonClicked
    .bind(wrapper));
  wrapper.emailInput.addEventListener("keyup", onEmailInput.bind(
    wrapper));
  wrapper.emailInput.addEventListener("keypress", onEnterPress.bind(
    wrapper));
  wrapper.sendMailButton.addEventListener("click", onEmailSent.bind(
    wrapper));
}

/**
 * Fills needed information for ics file in html placeholders.
 * @param {*} wrapper the class
 * @param {Post} post the Post object that needs to be sent
 */
function fillPostDetails(wrapper, post) {
  wrapper.title = document.querySelector("#title").value = post.title;
  wrapper.start = document.querySelector("#start").value = post.start;
  wrapper.end = document.querySelector("#end").value = post.end;
  wrapper.category = document.querySelector("#category").value = post.category;
  wrapper.faculty = document.querySelector("#faculty").value = post.faculty;
}

/**
 * If an email address is stored as a cookie, it'll be inserted into the input,
 * and the send button is not disabled, because there is something in the inputfield.
 * @param {*} wrapper the class
 */
function insertEmail(wrapper) {
  wrapper.emailInput.value = email;
  if (email !== Config.EMPTY_STRING) {
    wrapper.sendMailButton.classList.remove("disable-button");
  }
}

function onCloseButtonClicked() {
  this.hideMiddleLayer();
  resetDownLoadView(this);
}

/**
 * The sending of an email shall only be possible if something is written in 
 * input field. 
 */
function onEmailInput(event) {
  if (event.target.value !== "") {
    this.sendMailButton.classList.remove("disable-button");
  } else {
    this.sendMailButton.classList.add("disable-button");
  }
}

/**
 * If the iputfield is focussed, because the user is typing something, an 
 * enter-key-press will trigger some function of the inputfield. Because we 
 * already implemented custom Shortcuts for some of the popups, this function 
 * is not needed and also triggers unwanted behaviour. Therefore the action on enter
 * is disabled at this point.
 */
function onEnterPress(event) {
  if (event.keyCode === Config.ENTER_BUTTON_KEY_CODE) {
    event.preventDefault();
    return;
  }
}

/**
 * On sending an email, this event getr triggered and the used email is going
 * to be stored as a cookie.
 */
function onEmailSent() {
  this.notifyAll(new Event(Config.DOWNLOAD_POPUP_VIEW.EVENT.EMAIL_SENT, {
    insertedEmail: this.emailInput.value,
  }));
}

/**
 * @param {*} wrapper the class
 */
function resetDownLoadView(wrapper) {
  wrapper.emailInput.value = "";
  wrapper.sendMailButton.classList.add("disable-button");
}

class DownloadPopupView extends PopupView {
  constructor(el) {
    super(el);
    initElements(this);
  }

  setDataForICSFile(postData) {
    fillPostDetails(this, postData);
  }

  setEmail(emailInput) {
    email = emailInput;
  }

  showDownloadPopup() {
    insertEmail(this);
    this.showMiddleLayer();
  }

}

export default DownloadPopupView;