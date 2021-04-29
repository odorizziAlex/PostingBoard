/* eslint-env browser */
import View from "./View.js";
import Config from "../utils/Config.js";

// Initialize UI Elements
function initHeaderView(wrapper) {
  wrapper.loginButton = wrapper.el.querySelector(".button.login");
  wrapper.registerButton = wrapper.el.querySelector(".button.register");
  wrapper.buttonWrapper = wrapper.el.querySelector(".button-wrapper");
  wrapper.logo = wrapper.el.querySelector(".header-logo");
  wrapper.info = wrapper.el.querySelector("h1");
  initListeners(wrapper);
}

// Initialize Listeners
function initListeners(wrapper) {
  wrapper.loginButton.addEventListener("click", onLoginButtonClicked.bind(
    wrapper));
  wrapper.registerButton.addEventListener("click", onRegisterButtonClicked.bind(
    wrapper));
  wrapper.logo.addEventListener("click", onLogoClicked.bind(wrapper));
}

// Fire event if login button was clicked
function onLoginButtonClicked() {
  this.notifyAll(new Event(Config.HEADER_VIEW.EVENT.LOGIN_BUTTON_CLICKED));
}

// Fire event if register button was clicked
function onRegisterButtonClicked() {
  this.notifyAll(new Event(Config.HEADER_VIEW.EVENT.REGISTER_BUTTON_CLICKED));
}

// Fire event if logo was clicked
function onLogoClicked() {
  this.notifyAll(new Event(Config.HEADER_VIEW.EVENT.LOGO_CLICKED));
}

/**
 * 
 * Takes care of showing/hiding register/login button as well as showing current state of app
 * 
 */

class HeaderView extends View {

  constructor(el) {
    super(el);
    initHeaderView(this);
  }

  // Hide Register/Login buttons
  hideButtons() {
    this.buttonWrapper.classList.add("hidden");
  }

  // Show Register/Login buttons
  showButtons() {
    this.buttonWrapper.classList.remove("hidden");
  }

  // Set text of current state of app
  setInfoText(text) {
    this.info.innerHTML = text;
  }
}

export default HeaderView;