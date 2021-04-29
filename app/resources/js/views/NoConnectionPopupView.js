/* eslint-env browser */
import PopupView from "./PopupView.js";

function initElements(wrapper) {
  wrapper.popupTitle = document.querySelector(".connection-title");
  wrapper.popupMessage = document.querySelector(".connection-description");
}

class NoConnectionPopupView extends PopupView {

  constructor(el) {
    super(el);
    initElements(this);
  }

  showNoConnectionPopup(title, msg) {
    this.popupTitle.innerHTML = title;
    this.popupMessage.innerHTML = msg;
    this.showTopLayer();
  }

  reloadPostingBoard() {
    window.location.reload();
  }
}

export default NoConnectionPopupView;