/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";


// Init all UI Elements
function initElements(wrapper) {
  wrapper.close = wrapper.el.querySelector(".close");
  wrapper.usernameField = wrapper.el.querySelector(".username");
  wrapper.emailField = wrapper.el.querySelector(".email");
  wrapper.checkbox = wrapper.el.querySelector(".checkbox-show-password");
  wrapper.passwordWrapper = wrapper.el.querySelector(
    ".change-password-wrapper");
  wrapper.passwordFieldNew = wrapper.el.querySelector(".password.new");
  wrapper.passwordFieldNewRepeat = wrapper.el.querySelector(
    ".password.new-repeat");
  wrapper.saveUsernameButton = wrapper.el.querySelector(".button.username");
  wrapper.saveEmailButton = wrapper.el.querySelector(".button.email");
  wrapper.savePasswordButton = wrapper.el.querySelector(".button.password-btn");
  wrapper.resetFields();
}

// Init all listeners
function initListeners(wrapper) {
  wrapper.checkbox.addEventListener("click", function() {
    wrapper.passwordWrapper.classList.toggle("hidden");
  });
  wrapper.close.addEventListener("click", function() {
    wrapper.hideMiddleLayer();
    wrapper.resetFields();
  });
  wrapper.saveUsernameButton.addEventListener("click", (() => {
    saveButtonClicked(wrapper);
  }));
  wrapper.saveEmailButton.addEventListener("click", (() => {
    saveButtonClicked(wrapper);
  }));
  wrapper.savePasswordButton.addEventListener("click", (() => {
    saveButtonClicked(wrapper);
  }));
}

function initView(wrapper) {
  initElements(wrapper);
  initListeners(wrapper);
}

// Fires event if save button is clicked
function saveButtonClicked(wrapper) {
  wrapper.removeWarnings();
  let event = new Event(Config.EDIT_PROFILE_VIEW.EVENT.SAVE_BUTTON_CLICKED);
  wrapper.notifyAll(event);
}

/**
 * 
 * Show Popup where users can edit their given information 
 * 
 */

class EditProfileView extends PopupView {
  constructor(el) {
    super(el);
    initView(this);
  }

  // Update Value in Inputfields
  updateFields(username, email) {
    this.usernameField.value = username;
    this.emailField.value = email;
  }

  // Removes all warnings if shown
  removeWarnings() {
    this.usernameField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
    this.emailField.nextElementSibling.innerHTML = Config.EMPTY_STRING;
    this.passwordFieldNew.nextElementSibling.innerHTML = Config.EMPTY_STRING;
    this.passwordFieldNewRepeat.nextElementSibling.innerHTML = Config.EMPTY_STRING;
  }

  // Empty all input fields
  resetFields() {
    this.removeWarnings();
    this.passwordWrapper.classList.add("hidden");
    this.passwordFieldNew.value = "";
    this.passwordFieldNewRepeat.value = "";
    this.checkbox.checked = false;
  }

}

export default EditProfileView;