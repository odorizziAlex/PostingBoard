/* eslint-env browser */
import View from "./View.js";
import Config from "../utils/Config.js";

/**
 * 
 * Notifies user if actions were successful or failed at the bottom of the screen
 * 
 */


class ToastView extends View {

  constructor(el) {
    super(el);
  }

  // Set text of Toast Message
  setText(message) {
    this.el.innerHTML = message;
  }

  // Show success toast message
  showSuccess() {
    this.el.classList.add("success");
    this.el.classList.remove("error");
    this.changeVisibility();
    setTimeout(() => {
      this.changeVisibility();
    }, Config.TOAST_VIEW.TOAST_DELAY);
  }

  // Show error toast message
  showError() {
    this.el.classList.add("error");
    this.el.classList.remove("success");
    this.changeVisibility();
    setTimeout(() => {
      this.changeVisibility();
    }, Config.TOAST_VIEW.TOAST_DELAY);
  }
}

export default ToastView;