/* eslint-env browser */
import { Event, Observable } from "../utils/Observable.js";
import Config from "../utils/Config.js";

function initListeners(wrapper) {
  wrapper.view.addEventListener(Config.POST_VIEWS.EVENT.POST_CLICKED,
    onPostClicked.bind(
      wrapper));
  wrapper.view.addEventListener(Config.POST_VIEWS.EVENT.LOAD_BUTTON_CLICKED,
    onLoadButtonClicked
    .bind(wrapper));
  wrapper.view.addEventListener(Config.POST_VIEWS.EVENT
    .MORE_POSTS_BUTTON_CLICKED, wrapper
    .onMorePostsButtonClicked.bind(wrapper));
}

//changes displaying of posts
function refreshPosts(wrapper, list) {
  //list containing right number of posts
  let trimmedList = wrapper.model.getTrimmedList(list);
  //removes all posts from view
  wrapper.view.removeAllPosts();
  //adds posts to view
  wrapper.view.addPosts(trimmedList);
  toggleNoPostsInfo(wrapper, trimmedList);
  manageLoadButtonVisibility(wrapper, list, trimmedList);
}

//if more posts are there to show than shown via trimmedlist -> loadbutton is shown on the button of the page
function manageLoadButtonVisibility(wrapper, list, trimmedList) {
  if (trimmedList.length < list.length) {
    wrapper.view.showLoadButton();
  } else {
    wrapper.view.hideLoadButton();
  }
}

//list is list after filtering or all posts -> no posts info is shown, in case no post exists or filtering does not match any existing post
function toggleNoPostsInfo(wrapper, list) {
  if (list.length === 0) {
    wrapper.view.showNoPostsInfo();
  } else {
    wrapper.view.hideNoPostsInfo();
  }
}

//Before loadbutton is clicked -> max. 12 posts, first time loadbutton is clicked -> max. 24 posts, second time loadbutton is clicked -> max. 36 posts...
function onLoadButtonClicked() {
  this.model.increasePostMax();
  refreshPosts(this, this.model.getNeededList());
}

function onPostClicked(event) {
  let post = this.model.getPostDataById(event.data);
  this.notifyAll(new Event(Config.POSTS_CONTROLLER.EVENT.POST_CLICKED, post));
}

//serves as interface between postsmodel and postview
class PostsController extends Observable {

  constructor(view, model) {
    super();
    this.view = view;
    this.model = model;
    initListeners(this);
  }

  //Is triggered, if app starts, is refreshed or user is logged out -> posts are displayed randomly
  initialPosts(list) {
    this.model.initialPostsList(list);
    refreshPosts(this, this.model.getRandomizedList());
  }

  storePost(post) {
    this.model.addPost(post);
    refreshPosts(this, this.model.getNeededList());
  }

  //After updating, post in model is replace by updated one and postingboard is refreshed
  storePostAtIndexOfEditedPost(post) {
    this.model.replacePost(post);
    refreshPosts(this, this.model.getNeededList());
  }

  onMorePostsButtonClicked() {
    //Shows spinner, because postingboard will be refreshed
    this.showLoadSpinner();
    this.notifyAll(new Event(Config.POSTS_CONTROLLER.EVENT.REFRESH_POST));
  }

  sortByCategory(category) {
    refreshPosts(this, this.model.getSortedListByCategory(category));
  }

  sortByDate(date) {
    refreshPosts(this, this.model.getSortedListByDate(date));
  }

  sortByFaculty(faculty) {
    refreshPosts(this, this.model.getSortedListByFaculty(faculty));
  }

  sortByOrder(order) {
    refreshPosts(this, this.model.getSortedListByOrder(order));
  }

  sortByOwnPosts(checked, userId) {
    refreshPosts(this, this.model.getListOnOwnPostsClicked(checked,
      userId));
  }

  sortByFavourites(checked, userId) {
    refreshPosts(this, this.model.getListOnFavouritesClicked(checked,
      userId));
  }

  resetValues() {
    this.model.resetVariables();
  }

  deletePost(id) {
    this.model.deletePost(id);
    //In order to display the posts the right way
    refreshPosts(this, this.model.getNeededList());
  }

  showMorePostsButton() {
    this.view.showMorePostsButton();
  }

  //Because of (long) loading time the user is informed about it by loading-spinner
  showLoadSpinner() {
    this.view.showLoadSpinner();
  }

  hideLoadSpinner() {
    this.view.hideLoadSpinner();
  }

  //Is triggered, if favour-button is clicked in detailview
  favourisePost(post, currentUserId, isFavourised, filterFavourisedChecked) {
    if (isFavourised) {
      this.model.setPostAsFavourite(post, currentUserId);
    } else {
      this.model.unsetPostAsFavourite(post, currentUserId);
    }
    //True, if user toggles favourite-filter-button 
    if (filterFavourisedChecked !== this.model.getFavouriteModeState()) {
      this.sortByFavourites(filterFavourisedChecked, currentUserId);
    } else {
      //In order to handle favouring and the displaying posts in the right order after clicking favour-button
      refreshPosts(this, this.model.getNeededList());
    }
  }
}

export default PostsController;