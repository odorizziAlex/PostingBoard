import Config from "./Config.js";

//Boolean to prevent error, which happens, in case the user clicks the overlay while post is stored/updated
var isClickable = true;

function initElements(wrapper) {
  wrapper.popups = document.querySelectorAll(".popup");
  wrapper.deletePostPopup = document.querySelector(".popup-delete-post");
  wrapper.sendEmailPopup = document.querySelector(".popup-download-ics");
  wrapper.noConnectionPopup = document.querySelector(".no-connection-popup");
  wrapper.fullImagePopup = document.querySelector(".popup-post-image");
  wrapper.overlays = document.querySelectorAll(".overlay");
  wrapper.deleteProfilePopup = document.querySelector(
    ".popup-delete-profile");
  wrapper.editProfilePopup = document.querySelector(".edit-profile");
  wrapper.menu = document.querySelector(".slide-menu");
  initListeners(wrapper);
}

function initListeners(wrapper) {
  document.addEventListener("keyup", onKeyPress.bind(wrapper));
  Array.from(wrapper.overlays).forEach(overlay => overlay.addEventListener(
    "click", onOverlayClicked.bind(wrapper)));
}

/**
 * When one of the overlays is clicked, the menu closes, if it's open and
 *  all open popups close.
 */
function onOverlayClicked() {
  if (isClickable) {
    if (this.deletePostPopup.classList.contains("hidden") && this
      .fullImagePopup.classList.contains("hidden") && this.sendEmailPopup
      .classList.contains("hidden") && this.deleteProfilePopup.classList
      .contains("hidden") && this.editProfilePopup.classList.contains(
        "hidden")) {
      if (this.menu.classList.contains("open")) {
        this.menu.querySelector(".toggle-menu-icon").click();
      }
      for (let i = 0; i < this.popups.length; i++) {
        if (!this.popups[i].classList.contains("hidden")) {
          if (this.popups[i].querySelector(".close") !== null) {
            this.popups[i].querySelector(".close").click();
          }
        }
      }
    } else if (!this.fullImagePopup.classList.contains("hidden")) {
      this.fullImagePopup.click();
    } else if (!this.sendEmailPopup.classList.contains("hidden")) {
      this.sendEmailPopup.querySelector(".close").click();
    } else if (!this.editProfilePopup.classList.contains("hidden")) {
      this.editProfilePopup.querySelector(".close").click();
    }
  }
}

/**
 * 
 * If a popup contains a button, that confirms some type of manipulation or action,
 * then, it shall be accessable through the enter key.
 * If a Popup has a close button, it can be accessed via the escape key.
 */
function onKeyPress(event) {
  if (this.noConnectionPopup.classList.contains("hidden")) {
    // Enter pressed
    if (event.keyCode === Config.ENTER_BUTTON_KEY_CODE) {
      for (let i = 0; i < this.popups.length; i++) {
        if (!this.popups[i].classList.contains("hidden")) {
          if (this.popups[i].querySelector(".confirm") !== null && !this
            .popups[i].querySelector(".confirm").classList.contains(
              "disable-button")) {
            this.popups[i].querySelector(".confirm").click();
          }
        }
      }
      return;
    }
    // Escape pressed
    if (event.keyCode === Config.ESC_BUTTON_KEY_CODE) {
      if (this.deletePostPopup.classList.contains("hidden") && this
        .fullImagePopup.classList.contains("hidden") && this
        .sendEmailPopup
        .classList.contains("hidden") && this.editProfilePopup.classList
        .contains("hidden") && this.deleteProfilePopup.classList.contains(
          "hidden")) {
        if (this.menu.classList.contains("open")) {
          this.menu.querySelector(".toggle-menu-icon").click();
          return;
        }
        for (let i = 0; i < this.popups.length; i++) {
          if (!this.popups[i].classList.contains("hidden")) {
            if (this.popups[i].querySelector(".close") !== null) {
              this.popups[i].querySelector(".close").click();
            }
          }
        }
      } else if (!this.fullImagePopup.classList.contains("hidden")) {
        this.fullImagePopup.click();
      } else if (!this.sendEmailPopup.classList.contains("hidden")) {
        this.sendEmailPopup.querySelector(".close").click();
      } else if (!this.editProfilePopup.classList.contains("hidden")) {
        this.editProfilePopup.querySelector(".close").click();
      }
      return;
    }
  }
}

class Shortcuts {

  init() {
    initElements(this);
  }
  
  toggleClickable() {
    isClickable = !isClickable;
  }

}

export default new Shortcuts();