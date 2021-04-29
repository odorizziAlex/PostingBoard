/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

function initElements(wrapper) {
  wrapper.close = wrapper.el.querySelector(".close");
  wrapper.emailField = wrapper.el.querySelector(".email");
  wrapper.passwordField = wrapper.el.querySelector(".password");
  wrapper.forgotPassword = wrapper.el.querySelector(".link.forgot-password");
  wrapper.loginButton = wrapper.el.querySelector(".button.login");
}

function initListeners(wrapper) {
  wrapper.loginButton.addEventListener("click", onLoginButtonClicked.bind(
    wrapper));
  wrapper.close.addEventListener("click", function() {
    wrapper.changeVisibility();
    wrapper.resetFields();
  });
  wrapper.forgotPassword.addEventListener("click", onPasswordForgotClicked.bind(
    wrapper));
}

function initView(wrapper) {
  initElements(wrapper);
  initListeners(wrapper);
}

function onLoginButtonClicked() {
  let event = new Event(Config.LOGIN_VIEW.EVENT.LOGIN_BUTTON_CLICKED);
  this.notifyAll(event);
}

function onPasswordForgotClicked() {
  let event = new Event(Config.LOGIN_VIEW.EVENT.PASSWORD_FORGOT_CLICKED);
  this.notifyAll(event);
}

class LoginView extends PopupView {

  constructor(el) {
    super(el);
    initView(this);
  }

  insertEmailFromCookie(email) {
    this.emailField.value = email;
  }

  resetFields() {
    this.emailField.value = Config.EMPTY_STRING;
    this.passwordField.value = Config.EMPTY_STRING;
  }
}

export default LoginView;