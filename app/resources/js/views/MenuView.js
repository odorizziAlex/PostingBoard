/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import View from "./View.js";
import Config from "../utils/Config.js";

// Initialize UI Elements
function initElements(wrapper) {
  wrapper.menu = wrapper.el;
  wrapper.toggleIcon = wrapper.el.querySelector(".toggle-menu-icon");
  wrapper.username = wrapper.el.querySelector(".username");
  wrapper.email = wrapper.el.querySelector(".email-address");
  wrapper.editProfileBtn = wrapper.el.querySelector(".button.edit-profile");
  wrapper.deleteProfileBtn = wrapper.el.querySelector(".button.delete-profile");
  wrapper.filterOwnPosts = wrapper.el.querySelector(".own-posts");
  wrapper.filterFavourites = wrapper.el.querySelector(".favourite-posts");
  wrapper.btnLogout = wrapper.el.querySelector(".button.log-out");
  wrapper.appWrapper = document.querySelector(".app-wrapper");
  wrapper.appHeader = document.querySelector(".header");
  wrapper.overlay = document.querySelector(".overlay");
}

// Initialize Listeners
function initListener(wrapper) {
  wrapper.toggleIcon.addEventListener("click", wrapper.toggleMenu.bind(
    wrapper));
  wrapper.editProfileBtn.addEventListener("click", onEditButtonClicked.bind(
    wrapper));
  wrapper.deleteProfileBtn.addEventListener("click", onDeleteButtonClicked.bind(
    wrapper));
  wrapper.filterOwnPosts.addEventListener("click", onFilterOwnPostsClicked.bind(
    wrapper));
  wrapper.filterFavourites.addEventListener("click", onFilterFavouritesClicked
    .bind(wrapper));
  wrapper.btnLogout.addEventListener("click", onLogoutButtonClicked.bind(
    wrapper));
}

function initView(wrapper) {
  initElements(wrapper);
  initListener(wrapper);
}

// Fires event if edit button was clicked
function onEditButtonClicked() {
  let event = new Event(Config.MENU_VIEW.EVENT.EDIT_PROFILE_CLICKED);
  this.notifyAll(event);
}

// Fires event if delete button was clicked
function onDeleteButtonClicked() {
  let event = new Event(Config.MENU_VIEW.EVENT.DELETE_PROFILE_CLICKED);
  this.notifyAll(event);
}

// Toggle class of own-post filter
function toggleFilterOwnPostsButton(wrapper) {
  wrapper.filterOwnPosts.classList.toggle("active-user-filter");
}

// Toggle class of favorite-post filter
function toggleFilterFavouritesButton(wrapper) {
  wrapper.filterFavourites.classList.toggle("active-user-filter");
}

// Fires event if own-post filter was clicked
function onFilterOwnPostsClicked() {
  let checked;
  toggleFilterOwnPostsButton(this);
  checked = this.filterOwnPosts.classList.contains("active-user-filter");
  if (this.filterFavourites.classList.contains("active-user-filter")) {
    toggleFilterFavouritesButton(this);
  }
  this.notifyAll(new Event(Config.MENU_VIEW.EVENT.FILTER_BY_OWN_POSTS, checked));
}

// Fires event if favourite-post filter was clicked
function onFilterFavouritesClicked() {
  let checked;
  toggleFilterFavouritesButton(this);
  checked = this.filterFavourites.classList.contains("active-user-filter");
  if (this.filterOwnPosts.classList.contains("active-user-filter")) {
    toggleFilterOwnPostsButton(this);
  }
  this.notifyAll(new Event(Config.MENU_VIEW.EVENT.FILTER_BY_FAVOURISED, checked));
}

// Fires event if logout filter was clicked
function onLogoutButtonClicked() {
  let event = new Event(Config.MENU_VIEW.EVENT.LOGOUT_CLICKED);
  this.notifyAll(event);
}

/**
 * 
 * MenuView takes care of hiding/showing the menu (with click of the Menu-Icon as well as user-specific filtering)
 * 
 */

class MenuView extends View {
  constructor(el) {
    super(el);
    initView(this);
  }

  // Toggle menu based on current state
  toggleMenu() {
    this.menu.classList.toggle("open");
    this.appWrapper.classList.toggle("blur");
    this.appHeader.classList.toggle("blur");
    this.overlay.classList.toggle("hidden");
  }

  // Hide Menu
  hideMenu() {
    this.menu.classList.remove("open");
    this.appWrapper.classList.remove("blur");
    this.appHeader.classList.remove("blur");
    this.overlay.classList.add("hidden");
  }

  // Show the Menu Icon
  showMenuIcon() {
    this.toggleIcon.classList.remove("hidden");
  }

  // Hide the Menu Icon
  hideMenuIcon() {
    this.toggleIcon.classList.add("hidden");
  }

  // Returns Boolean if user's favorite filter is currently active
  getIsFilterFavouritesChecked() {
    return this.filterFavourites.classList.contains("active-user-filter");
  }

  // Reset currently set filters
  resetMenuFilters() {
    this.filterOwnPosts.classList.remove("active-user-filter");
    this.filterFavourites.classList.remove("active-user-filter");
  }

  // Set both username and email to UI Element in Menu
  setUserInfo(username, email) {
    this.username.innerHTML = username;
    this.email.innerHTML = email;
  }

  // Set given username to UI Element in Menu
  setUsername(username) {
    this.username.innerHTML = username;
  }

  // Set given email to UI Element in Menu
  setEmail(email) {
    this.email.innerHTML = email;
  }
}

export default MenuView;