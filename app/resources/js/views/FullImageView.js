/* eslint-env browser */
import PopupView from "./PopupView.js";

function onImageClicked() {
  this.hideMiddleLayer();
}

//Represents the image shown after clicking on the image in the detailview
class FullImageView extends PopupView {
  constructor(el) {
    super(el);
    this.el.addEventListener("click", onImageClicked.bind(this));
  }

  //sets
  setImage(src) {
    this.el.firstElementChild.src = src;
  }

}

export default FullImageView;