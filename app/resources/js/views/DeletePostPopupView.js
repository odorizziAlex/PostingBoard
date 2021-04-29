/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import PopupView from "./PopupView.js";
import Config from "../utils/Config.js";

/**
 * DESCRIPTION: This contains the listener for the post delete popup. 
 */

function initElements(view) {
  view.cancelButton = view.el.querySelector(".cancel-post-deletion");
  view.deleteButton = view.el.querySelector(".delete-post-final");
  initListeners(view);
}

function initListeners(view) {
  view.cancelButton.addEventListener("click", onCancelButtonClicked.bind(
    view));
  view.deleteButton.addEventListener("click", onDeleteButtonClicked.bind(
    view));
}

function onCancelButtonClicked() {
  this.hideMiddleLayer();
}

function onDeleteButtonClicked() {
  this.notifyAll(new Event(Config.DELETE_POST_POPUP_VIEW.EVENT
    .DELETE_POST_FINAL));
}

class DeletePostPopupView extends PopupView {
  constructor(el) {
    super(el);
    this.el = el;
    initElements(this);
  }

}

export default DeletePostPopupView;