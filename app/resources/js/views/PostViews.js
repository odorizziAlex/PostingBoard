/* eslint-env browser */
import View from "./View.js";
import { Event } from "../utils/Observable.js";
import DateChecker from "../utils/DateChecker.js";
import Config from "../utils/Config.js";

var template = document.getElementsByTagName("template")[0],
  postElement = template.content.querySelector(".post"),
  postOverlay = template.content.querySelector(".post-overlay"),
  postTitle = template.content.querySelector("h4"),
  postFromDate = template.content.querySelector(".date.from"),
  postToDate = template.content.querySelector(".date.to"),
  image = template.content.querySelector("img");

function initElements(wrapper) {
  wrapper.loadButton = document.querySelector(".load-more-wrapper .button");
  wrapper.morePostsButton = document.querySelector(".new-posts-available");
  wrapper.noPostsInfo = document.querySelector(".no-posts-wrapper");
  wrapper.loadSpinner = document.querySelector("body > .while-upload-overlay");
  initListeners(wrapper);
}

function initListeners(wrapper) {
  wrapper.morePostsButton.addEventListener("click", onMorePostButtonClicked
    .bind(wrapper));
  wrapper.loadButton.addEventListener("click", onLoadButtonClicked.bind(
    wrapper));
  wrapper.el.addEventListener("click", onPostClicked.bind(wrapper));
}

function onLoadButtonClicked() {
  this.notifyAll(new Event(Config.POST_VIEWS.EVENT.LOAD_BUTTON_CLICKED));
}

function onPostClicked(event) {
  //Important to seperate parent node from children (originalTarget is a firefox attribute).
  let target = event.target.parentNode,
    postId = target.id;
  if (event.target === this.el) {
    return;
  }
  this.notifyAll(new Event(Config.POST_VIEWS.EVENT.POST_CLICKED, postId));
}

function onMorePostButtonClicked() {
  this.morePostsButton.classList.add("hidden");
  this.notifyAll(new Event(Config.POST_VIEWS.EVENT.MORE_POSTS_BUTTON_CLICKED));
}

//Represents all posts visible in the postingboard
class PostViews extends View {

  constructor(el) {
    super(el);
    initElements(this);
  }

  addPosts(list) {
    let post,
      file;
    for (let i = 0; i < list.length; i++) {
      post = list[i];
      file = post.file;
      //file is undefined, if there is an problem with loading the image from the database. 
      if (file !== undefined) {
        image.src = URL.createObjectURL(file);
      } else {
        //sets an default image, if there is an problem with loading the image from the database. 
        image.src = Config.POST_VIEWS.DEFAULT_IMAGE_PATH;
      }
      postTitle.innerHTML = post.title;
      postFromDate.innerHTML = DateChecker.getGermanDateFormat(post.start);
      postToDate.innerHTML = DateChecker.getGermanDateFormat(post.end);
      //color of faculty on hovering
      postOverlay.style.background = Config.POST_VIEWS
        .FACULTY_COLORS_TRANSPARENT[post
          .faculty];
      let child = document.importNode(postElement, true);
      //id of html-element is id of post -> possible to figure out, which post was clicked
      child.setAttribute("id", post.id);
      this.el.append(child);
    }
  }

  showMorePostsButton() {
    this.morePostsButton.classList.remove("hidden");
  }

  showLoadSpinner() {
    this.loadSpinner.classList.remove("hidden");
  }

  hideLoadSpinner() {
    this.loadSpinner.classList.add("hidden");
  }

  showNoPostsInfo() {
    this.noPostsInfo.classList.remove("hidden");
  }

  hideNoPostsInfo() {
    this.noPostsInfo.classList.add("hidden");
  }

  showLoadButton() {
    this.loadButton.classList.remove("hidden");
  }

  hideLoadButton() {
    this.loadButton.classList.add("hidden");
  }

  //removes all posts (is triggered before drawing them)
  removeAllPosts() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }

}

export default PostViews;