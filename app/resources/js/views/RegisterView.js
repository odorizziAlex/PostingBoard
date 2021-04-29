/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

// Fires event if register button was clicked
function onRegisterButtonClicked() {
  removeWarnings(this);
  let event = new Event(Config.REGISTER_VIEW.EVENT.REGISTER_CLICKED, this);
  this.notifyAll(event);
}

// Reset the input fields so no info is shown
function resetFields(wrapper) {
  removeWarnings(wrapper);
  wrapper.usernameField.value = Config.EMPTY_STRING;
  wrapper.emailField.value = Config.EMPTY_STRING;
  wrapper.passwordField.value = Config.EMPTY_STRING;
}

// Remove warnings of input fields
function removeWarnings(wrapper) {
  wrapper.usernameField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  wrapper.emailField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  wrapper.passwordField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
}

// Initialize UI Elements
function initElements(wrapper) {
  wrapper.close = wrapper.el.querySelector(".close");
  wrapper.usernameField = wrapper.el.querySelector(".username");
  wrapper.emailField = wrapper.el.querySelector(".email");
  wrapper.passwordField = wrapper.el.querySelector(".password");
  wrapper.registerButton = wrapper.el.querySelector(".button.register");
  resetFields(wrapper);
}

// Initialize Listeners
function initListeners(wrapper) {
  wrapper.registerButton.addEventListener("click", onRegisterButtonClicked.bind(
    wrapper));
  wrapper.close.addEventListener("click", function() {
    wrapper.changeVisibility();
    resetFields(wrapper);
  });
}

function initView(wrapper) {
  initElements(wrapper);
  initListeners(wrapper);
}

/**
 * 
 * Shows popup where a user can create a personal account
 * 
 */

class RegisterView extends PopupView {
  constructor(el) {
    super(el);
    initView(this);
  }
}

export default RegisterView;