/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

// Initialize UI Elements
function initElements(wrapper) {
  wrapper.close = wrapper.el.querySelector(".close");
  wrapper.emailField = wrapper.el.querySelector(".email");
  wrapper.sendButton = wrapper.el.querySelector(".button.send-email");
  wrapper.resetFields();
  initListeners(wrapper);
}

// Initialize Listeners
function initListeners(wrapper) {
  wrapper.emailField.addEventListener("keypress", onEnterKeyPress.bind(
    wrapper));
  wrapper.sendButton.addEventListener("click", onSendButtonClicked.bind(
    wrapper));
  wrapper.close.addEventListener("click", function() {
    wrapper.hide();
    wrapper.resetFields();
  });
}

// Prevents default action if input field is active
function onEnterKeyPress(event) {
  if (event.keyCode === Config.ENTER_BUTTON_KEY_CODE) {
    event.preventDefault();
  }
}

// Fires event if send button was clicked
function onSendButtonClicked() {
  let event = new Event(Config.FORGOT_PASSWORD_VIEW.EVENT.SEND_BUTTON_CLICKED, this.emailField.value);
  this.notifyAll(event);
}

/**
 * 
 * Shows Popup where user can insert their email address if they forgot their current password
 * 
 */

class ForgotPasswordView extends PopupView {
  constructor(el) {
    super(el);
    initElements(this);
  }

  // Resets the input fields
  resetFields() {
    this.emailField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
    this.emailField.value = Config.EMPTY_STRING;
  }

}

export default ForgotPasswordView;