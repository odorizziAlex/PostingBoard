/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

// Initialize UI Elements
function initElements(view) {
  view.cancelButton = view.el.querySelector(".cancel-profile-deletion");
  view.deleteButton = view.el.querySelector(".delete-profile-final");
  initListeners(view);
}

// Initialize Listeneres
function initListeners(view) {
  view.cancelButton.addEventListener("click", onCancelButtonClicked.bind(
    view));
  view.deleteButton.addEventListener("click", onDeleteButtonClicked.bind(
    view));
}

// Hide Overlay if cancel button was clicked
function onCancelButtonClicked() {
  this.hideMiddleLayer();
}

// Fires event if delete button was clicked
function onDeleteButtonClicked() {
  this.notifyAll(new Event(Config.DELETE_PROFILE_POPUP_VIEW.EVENT.DELETE_PROFILE_BUTTON_CLICKED));
}

/**
 * 
 * Re-asks user if profile should really be deleted
 * 
 */

class DeleteProfilePopupView extends PopupView {
  constructor(el) {
    super(el);
    this.el = el;
    initElements(this);
  }

}

export default DeleteProfilePopupView;