/* eslint-env browser */
import View from "./View.js";

/**
 * DESCRIPTION: This class makes the basic functionality of every popup that we have
 * available by extending from this class. Along with every popup shows an overlay, that 
 * raises the popup from the background and blurres everything underneath the open popup 
 * and the overlay. There are three different layers of overlays. All are separated by a 
 * different z-index in css.
 */

function initElements(wrapper) {
  wrapper.overlay = document.querySelector(".overlay");
  wrapper.secondLayerOverlay = document.querySelector(".second-layer-overlay");
  wrapper.thirdLayerOverlay = document.querySelector(".third-layer-overlay");
  wrapper.appWrapper = document.querySelector(".app-wrapper");
  wrapper.appHeader = document.querySelector(".header");
  wrapper.menuView = document.querySelector(".slide-menu");
  wrapper.detailPostPopup = document.querySelector(".detail-post");
  wrapper.toast = document.querySelector(".toast");
  wrapper.noConnectionPopup = document.querySelector(".no-connection-popup");
  wrapper.popups = document.querySelectorAll(".popup");
}

/**
 * The menuView has an additional disable class, which makes it not clickable.
 * This is needed, because the menu view is on the same level of z-index as the first layer popups,
 *  which menas it is still clickable even though there is an open overlay.
 * To avoid using another overlay for the case that the menu-slide is open, its function will be disabled,
 *  when another popup is currently open.
 */
function blurBaseElements(wrapper) {
  wrapper.appWrapper.classList.add("blur");
  wrapper.appHeader.classList.add("blur");
  wrapper.menuView.classList.add("blur");
  wrapper.menuView.classList.add("disable");
}
function unblurBaseElements(wrapper) {
  wrapper.appWrapper.classList.remove("blur");
  wrapper.appHeader.classList.remove("blur");
  wrapper.menuView.classList.remove("blur");
  wrapper.menuView.classList.remove("disable");
}

class PopupView extends View {
  constructor(el) {
    super(el);
    initElements(this);
  }

  // Shows first layer popup oberlay and blurres everything underneath it
  show() {
    super.show();
    this.overlay.classList.remove("hidden");
    blurBaseElements(this);
  }

  // Shows middle layer popup and overlay
  showMiddleLayer() {
    super.show();
    this.secondLayerOverlay.classList.remove("hidden");
    if (!this.detailPostPopup.classList.contains("hidden")) {
      this.detailPostPopup.classList.add("blur");
    }
    if (this.menuView.classList.contains("open")) {
      this.menuView.classList.add("blur");
    }
  }

  // Shows top layer popup and overlay
  showTopLayer() {
    super.show();
    this.thirdLayerOverlay.classList.remove("hidden");
    blurBaseElements(this);
    this.toast = document.querySelector(".toast");
    for (let i = 0; i < this.popups.length; i++) {
      if (!this.popups[i].classList.contains("hidden") && this.popups[i] !==
        this.noConnectionPopup) {
        this.popups[i].classList.add("blur");
      }
    }
  }

  // Hides first layer popup and overlay 
  hide() {
    super.hide();
    this.overlay.classList.add("hidden");
    unblurBaseElements(this);
  }
  
  // Hides second layer popup and overlay 
  hideMiddleLayer() {
    super.hide();
    this.secondLayerOverlay.classList.add("hidden");
    if (!this.detailPostPopup.classList.contains("hidden")) {
      this.detailPostPopup.classList.remove("blur");
    }
    if (this.menuView.classList.contains("open")) {
      this.menuView.classList.remove("blur");
    }
  }
  
  // Hides top layer popup and overlay 
  hideTopLayer() {
    super.hide();
    this.thirdLayerOverlay.classList.add("hidden");
    unblurBaseElements(this);
    this.toast = document.querySelector(".toast");
    for (let i = 0; i < this.popups.length; i++) {
      if (!this.popups[i].classList.contains("hidden") && this.popups[i] !==
        this.noConnectionPopup) {
        this.popups[i].classList.remove("blur");
      }
    }
  }

  /**
   * Username, password and email warnkings are used in several popups
   * which is the reason for making it a extendable function. 
   * @param {*} message msg you want to show in the warning
   */
  setUsernameWarning(message) {
    this.el.querySelector(".username").nextElementSibling.innerHTML = message;
  }
  setEmailWarning(message) {
    this.el.querySelector(".email").nextElementSibling.innerHTML = message;
  }
  setPasswordWarning(message) {
    this.el.querySelectorAll(".password").forEach(function(field) {
      field.nextElementSibling.innerHTML = message;
    });
  }

  // Toggle function for the first layer overlay and popup
  changeVisibility() {
    super.changeVisibility();
    this.overlay.classList.toggle("hidden");
    this.appWrapper.classList.toggle("blur");
    this.appHeader.classList.toggle("blur");
    this.menuView.classList.toggle("blur");
    this.menuView.classList.toggle("disable");
  }
}

export default PopupView;