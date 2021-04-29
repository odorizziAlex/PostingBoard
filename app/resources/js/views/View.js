/* eslint-env browser */
import Observable from "../utils/Observable.js";

//parent module for all views defined for the app with hide, show functions
class View extends Observable {

  constructor(el) {
    super();
    this.el = el;
  }

  show() {
    this.el.classList.remove("hidden");
  }

  hide() {
    this.el.classList.add("hidden");
  }

  changeVisibility() {
    this.el.classList.toggle("hidden");
  }

}

export default View;