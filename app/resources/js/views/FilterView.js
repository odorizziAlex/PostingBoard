/* eslint-env browser */
import { Event } from "../utils/Observable.js";
import Config from "../utils/Config.js";
import View from "./View.js";
import DateChecker from "../utils/DateChecker.js";

let calendar;

function initFilterView(wrapper) {
  wrapper.buttons = {
    categoryButton: wrapper.el.querySelector(".category-filter-button"),
    facultyButton: wrapper.el.querySelector(".faculty-filter-button"),
    orderButton: wrapper.el.querySelector(".order-filter-button"),
    dateButton: wrapper.el.querySelector(".date-filter-button"),
    addButton: wrapper.el.querySelector(".add-post"),
    resetDateFilterButton: wrapper.el.querySelector(
      ".filter-date-reset-button"),
    resetFacultyFilterButton: wrapper.el.querySelector(
      ".filter-faculty-reset-button"),
    resetCategoryFilterButton: wrapper.el.querySelector(
      ".filter-category-reset-button"),
    resetOrderFilterButton: wrapper.el.querySelector(
      ".filter-order-reset-button"),
    verifyButton: wrapper.el.querySelector(".verify-profile .button"),
  };
  wrapper.dropDowns = {
    categoryDropDown: wrapper.el.querySelector(".category").lastElementChild,
    facultyDropDown: wrapper.el.querySelector(".faculty").lastElementChild,
    orderDropdown: wrapper.el.querySelector(".order").lastElementChild,
    dateDropDown: wrapper.el.querySelector(".date").lastElementChild,
  };
  wrapper.datePickerOuterWrapper = wrapper.el.querySelector("#filter");
  wrapper.datePickerWrapper = wrapper.el.querySelector(".date-filter");
  wrapper.verifyInfo = wrapper.el.querySelector(".verify-profile");
  wrapper.verifyInfoText = wrapper.verifyInfo.querySelector("p");
  initListeners(wrapper);
}

function initListeners(wrapper) {
  wrapper.dropDowns.categoryDropDown.addEventListener("click", onCategoryChosen
    .bind(wrapper));
  wrapper.dropDowns.facultyDropDown.addEventListener("click", onFacultyChosen
    .bind(wrapper));
  wrapper.dropDowns.orderDropdown.addEventListener("click", onOrderChosen.bind(
    wrapper));
  wrapper.buttons.resetDateFilterButton.addEventListener("click",
    onResetDateFilterButton.bind(wrapper));
  wrapper.buttons.resetFacultyFilterButton.addEventListener("click",
    onResetFacultyFilterButton.bind(wrapper));
  wrapper.buttons.resetCategoryFilterButton.addEventListener("click",
    onResetCategoryFilterButton.bind(wrapper));
  wrapper.buttons.resetOrderFilterButton.addEventListener("click",
    onResetOrderFilterButton.bind(wrapper));
  wrapper.datePickerOuterWrapper.addEventListener("mouseenter",
    onMouseEnterDatePicker.bind(wrapper));
  wrapper.datePickerOuterWrapper.addEventListener("mouseleave",
    onMouseLeaveDatePicker.bind(wrapper));
  wrapper.buttons.addButton.addEventListener("click", addButtonClicked
    .bind(wrapper));
  wrapper.buttons.verifyButton.addEventListener("click", verifyButtonClicked
    .bind(wrapper));
}

//Following 3 functions add the reset-button for filter and sets the chosen filter as text for the button
function onCategoryChosen(event) {
  let category = event.target.innerHTML;
  //Prevents choosing all faculties at once on moving a pressed mouse over list elements and chosing the same faculty again
  if (category !== this.buttons.categoryButton.innerHTML && event.target !==
    this.dropDowns.categoryDropDown) {
    this.buttons.resetCategoryFilterButton.classList.remove("hidden");
    this.buttons.categoryButton.innerHTML = category;
    this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.CATEGORY_CHOSEN,
      category));
  }
}

function onFacultyChosen(event) {
  let faculty = event.target.innerHTML;
  //Prevents choosing all faculties at once on moving a pressed mouse over list elements and chosing the same faculty again
  if (faculty !== this.buttons.facultyButton.innerHTML && event.target !==
    this.dropDowns.facultyDropDown) {
    this.buttons.resetFacultyFilterButton.classList.remove("hidden");
    this.buttons.facultyButton.innerHTML = faculty;
    this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.FACULTY_CHOSEN, faculty));
  }
}

function onOrderChosen(event) {
  let order = event.target.innerHTML;
  //Prevents choosing all faculties at once on moving a pressed mouse over list elements and chosing the same faculty again
  if ((order !== this.buttons.orderButton.innerHTML && event.target !==
      this.dropDowns.orderDropdown)) {
    this.buttons.resetOrderFilterButton.classList.remove("hidden");
    this.buttons.orderButton.innerHTML = order;
    this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.ORDER_CHOSEN, order));
  }
}

function onMouseEnterDatePicker() {
  this.datePickerWrapper.appendChild(calendar);
}

function onMouseLeaveDatePicker() {
  this.datePickerWrapper.removeChild(calendar);
}

//Following 4 functions set filter button to its default value and the reset-button will be hidden
function onResetFacultyFilterButton() {
  this.buttons.resetFacultyFilterButton.classList.add("hidden");
  this.buttons.facultyButton.innerHTML = Config.ALL_FACULTIES;
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.RESET_FILTER_FACULTY));
}

function onResetCategoryFilterButton() {
  this.buttons.resetCategoryFilterButton.classList.add("hidden");
  this.buttons.categoryButton.innerHTML = Config.ALL_CATEGORIES;
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.RESET_FILTER_CATEGORY));
}

function onResetOrderFilterButton() {
  this.buttons.resetOrderFilterButton.classList.add("hidden");
  this.buttons.orderButton.innerHTML = Config.ORIGINAL_ORDER;
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.RESET_FILTER_ORDER));
}

function onResetDateFilterButton() {
  this.buttons.resetDateFilterButton.classList.add("hidden");
  this.buttons.dateButton.innerHTML = Config.ALL_DATES;
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.RESET_FILTER_DATE));
}

function addButtonClicked() {
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.ADD_BUTTON_CLICKED));
}

function verifyButtonClicked() {
  this.notifyAll(new Event(Config.FILTER_VIEW.EVENT.VERIFY_BUTTON_CLICKED));
}

class FilterView extends View {

  constructor(el) {
    super(el);
    initFilterView(this);
  }

  setCalendar(cal) {
    calendar = cal;
  }

  //triggerd if date is picked from calender for filtering
  setDate(date) {
    this.buttons.resetDateFilterButton.classList.remove("hidden");
    this.buttons.dateButton.innerHTML = DateChecker.getGermanDateFormat(date);
  }

  //not verified user or not logged in
  hideAddButton() {
    this.buttons.addButton.classList.add("hidden");
  }

  //in case user is verified and logged in
  showAddButton() {
    this.buttons.addButton.classList.remove("hidden");
  }

  //logged in but not verified
  showVerifyInfo() {
    this.verifyInfo.classList.remove("hidden");
  }

  //user can send a mail to verify account
  showVerifyInfoButton() {
    this.buttons.verifyButton.classList.remove("hidden");
  }

  //user can not send a mail to verify account
  hideVerifyInfoButton() {
    this.buttons.verifyButton.classList.add("hidden");
  }

  //text depending on verify-button state
  setVerifyInfoText(text) {
    this.verifyInfoText.innerHTML = text;
  }

  hideVerifyInfo() {
    this.verifyInfo.classList.add("hidden");
  }

  //resets filter and hide reset-buttons for filters
  resetFilter() {
    this.buttons.dateButton.innerHTML = Config.ALL_DATES;
    this.buttons.facultyButton.innerHTML = Config.ALL_FACULTIES;
    this.buttons.categoryButton.innerHTML = Config.ALL_CATEGORIES;
    this.buttons.orderButton.innerHTML = Config.ORIGINAL_ORDER;
    this.buttons.resetCategoryFilterButton.classList.add("hidden");
    this.buttons.resetFacultyFilterButton.classList.add("hidden");
    this.buttons.resetDateFilterButton.classList.add("hidden");
    this.buttons.resetOrderFilterButton.classList.add("hidden");
  }
}

export default FilterView;