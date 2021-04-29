/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

// Fires event if reset button was clicked
function onResetClicked() {
  let event = new Event("resetClicked", this.passwordField.value);
  this.notifyAll(event);
}

// Prevents default action of enter if input field is active
function onEnterPressed(event) {
  if (event.keyCode === Config.ENTER_BUTTON_KEY_CODE) {
    event.preventDefault();
  }
}
// Initialize UI Elements
function initElements(wrapper) {
  wrapper.close = wrapper.el.querySelector(".close");
  wrapper.passwordField = wrapper.el.querySelector(".password");
  wrapper.resetButton = wrapper.el.querySelector(".button.reset");
  wrapper.resetFields();
}

// Initialize Listneres
function initListeners(wrapper) {
  wrapper.passwordField.addEventListener("keypress", onEnterPressed.bind(
    wrapper));
  wrapper.resetButton.addEventListener("click", onResetClicked.bind(
    wrapper));
  wrapper.close.addEventListener("click", function() {
    wrapper.changeVisibility();
    wrapper.resetFields();
  });
}

function initView(wrapper) {
  initElements(wrapper);
  initListeners(wrapper);
}

/**
 * Shows Popup once user clicked on url to reset their password
 */

class ResetPasswordView extends PopupView {

  constructor(el) {
    super(el);
    initView(this);
  }

  // Empty all input fields
  resetFields() {
    this.passwordField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
    this.passwordField.value = Config.EMPTY_STRING;
  }
}

export default ResetPasswordView;