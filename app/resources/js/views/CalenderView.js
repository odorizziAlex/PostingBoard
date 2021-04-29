/* eslint-env browser */
import { Event, Observable } from "../utils/Observable.js";
import Config from "../utils/Config.js";

/**
 * SOURCE:
 * Parts from the code in this file are based on the content of this Website: 
 * https://webdevtrick.com/html-css-javascript-calendar/
 * 
 * DESCRIPTION: This Class is for all Calendars in the app. Every Calendar has a different
 * context, and therefore it has to show different selectable days. 
 * - Filter Calendar: Makes all dates selectable, if they are the current day or days 
 * after today.
 * - Upload Calendars: In the upload popup are two calendars. The first one shows when a
 * a time period starts. Here, all days are selectable, except days before the current day. 
 * If a end date has been selected before, the last selectable day, is the end date.
 * The second calendar is made to pick the end of the time period for a post. All days 
 * are selectable on this calendar, except the ones that are before the current day and 
 * the ones that are before the previously picked date in the start calendar.
 */

let month = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember",
  ],
  weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag",
    "Freitag", "Samstag",
  ],
  viewClass,
  calenderHeaderM,
  calenderHeaderY,
  weekdaysEl,
  daysRowEl,
  buttonLeft,
  buttonRight,
  dayFieldsEl,
  monthDirection = 0,
  startDate,
  endDate;

function initElements(view) {
  viewClass = view;
  // Elements
  view.calendar = view.el.content.cloneNode(true).firstElementChild;
  calenderHeaderM = view.calendar.querySelector(".month");
  calenderHeaderY = view.calendar.querySelector(".year");
  weekdaysEl = view.calendar.querySelector(".weekdays").children;
  daysRowEl = view.calendar.querySelector(".day-rows").children;
  // Buttons
  buttonLeft = view.calendar.querySelector(".arrow-left");
  buttonRight = view.calendar.querySelector(".arrow-right");
  dayFieldsEl = view.calendar.getElementsByClassName("day-field");
  initListeners(view);
}

function initListeners(view) {
  buttonLeft.addEventListener("click", getNextOrPrevMonth.bind(view));
  buttonRight.addEventListener("click", getNextOrPrevMonth.bind(view));
  Array.from(dayFieldsEl).forEach(dayField => dayField.addEventListener("click",
    onDayFieldClicked.bind(view)));
}

/**
 * Callback for right and left arrow on every calendar.
 * Initializes Calendar with the needed Parameters.
 */
function getNextOrPrevMonth(event) {
  let arrowClassList = event.target.classList,
    current,
    now = new Date(),
    parent = viewClass.calendar.parentNode;

  if (arrowClassList.contains(Config.CALENDAR_VIEW.NEXT_MONTH)) {
    monthDirection++;
  } else if (arrowClassList.contains(Config.CALENDAR_VIEW.PREVIOUS_MONTH)) {
    monthDirection--;
  }

  if (now.getMonth() === Config.CALENDAR_VIEW.MONTH_NUM) {
    current = new Date(now.getFullYear() + monthDirection, 0, 1);
  } else {
    current = new Date(now.getFullYear(), now.getMonth() + monthDirection, 1);
  }

  if (startDate !== undefined &&
    parent.classList.contains("date-to")) {
    let pickedStartDate = new Date(startDate);
    initCalendar("to", pickedStartDate, null, getTheMonth(current));
  } else if (endDate !== undefined &&
    parent.classList.contains("date-from")) {
    let pickedEndDate = new Date(endDate);
    initCalendar("from", null, pickedEndDate, getTheMonth(current));
  } else {
    initCalendar("init", null, null, getTheMonth(current));
  }
}

/**
 * Returns the data for the whole month of the parameter.
 * @param {*} currentDay can be any day formatted as a Date() Object.
 */
function getTheMonth(currentDay) {
  let currentMonth = month[currentDay.getMonth()],
    monthList = [];

  viewClass.pickedMonth = currentDay;

  for (let i = 1 - currentDay.getDate(); i < Config.CALENDAR_VIEW
    .MAX_MONTH_DAY_NUM; i++) {
    let tomorrow = new Date(currentDay);
    tomorrow.setDate(currentDay.getDate() + i);
    if (currentMonth !== month[tomorrow.getMonth()]) {
      break;
    } else {
      monthList.push({
        date: {
          weekday: weekday[tomorrow.getDay()],
          day: tomorrow.getDate(),
          month: month[tomorrow.getMonth()],
          year: tomorrow.getFullYear(),
          dateInfo: tomorrow,
        },
      });
    }
  }
  return monthList;
}

/**
 * This Function initializes the needed Calendar.
 * @param {*} id from the calendar that is durrently needed. Different calendars need different treatment
 * @param {*} day the day the user selected first (from calendar in upload popup; filter calendar)
 * @param {*} day2 the second day the user selected (to calendar in uploadView popup)
 * @param {*} monthData the data from the currently displayed month (Sunday, 1. September 2019...)
 */
function initCalendar(id, day, day2, monthData) {
  let row = 0,
    dayFieldRow,
    today = new Date(),
    maxRows = 6;

  if (day !== null) {
    today = day;
  }

  clearCalendar();

  for (let i = 0; i < monthData.length; i++) {
    let weekday = monthData[i].date.weekday,
      day = monthData[i].date.day,
      column = 0;

    updateCalendarHeader(monthData[0].date.month, monthData[0].date.year);

    dayFieldRow = daysRowEl[row].children;
    for (let j = 0; j < weekdaysEl.length; j++) {
      if (weekdaysEl[j].dataset.weekday === weekday) {
        column = Number(weekdaysEl[j].dataset.column);
        break;
      }
    }
    if (column === maxRows) {
      row++;
    }

    dayFieldRow[column].innerHTML = day;
    fillCalendar(id, today, day2, monthData[i], dayFieldRow, column);
  }
}

function clearCalendar() {
  for (let i = 0; i < dayFieldsEl.length; i++) {
    dayFieldsEl[i].classList.remove("selectable");
    dayFieldsEl[i].innerHTML = Config.EMPTY_STRING;
  }
}

function updateCalendarHeader(month, year) {
  calenderHeaderM.innerHTML = month;
  calenderHeaderY.innerHTML = year;
}

/**
 * This function formats the calendar.
 * The needed format get's passed via the id. 
 * @param {*} calId the id from the currently shown calendar
 * @param {*} day the day the user firstly selected (from calendar in upload popup/ filter calendar)
 * @param {*} day2 the second day the user selected (to calendar in upload popup)
 * @param {*} monthData the data from the currently displayed month (Sunday, 1. September 2019...)
 * @param {*} dayFieldRow a row in the calendar (one row sunday to saturday)
 * @param {*} column a column in the calendar (all numbers below sunday)
 */
function fillCalendar(calId, day, day2, monthData, dayFieldRow, column) {
  // Create only datestapms and not time stamps.
  let today = day.getFullYear() + "" + day.getMonth() + "" + day.getDate(),
    dayFromMonthData = monthData.date.dateInfo.getFullYear() + "" + monthData
    .date.dateInfo.getMonth() + "" + monthData.date.dateInfo.getDate();

  // If the Id is equal to "init", the calendar will be set to it's default appearance.
  if (calId === "init") {
    if (day.getTime() < monthData.date.dateInfo.getTime() ||
      today === dayFromMonthData) {
      dayFieldRow[column].classList.add("selectable");
    }
    // This statement checks if the "from" calendar from the upload popup needs to be initialised.
    // The difference here is, that the endDate has been picked already.
    // So this formatting shows an area of selectable days in the calender.
  } else if (calId === "from") {
    if ((day.getTime() < monthData.date.dateInfo.getTime() &&
        monthData.date.dateInfo.getTime() <= day2.getTime()) ||
      today === dayFromMonthData) {
      dayFieldRow[column].classList.add("selectable");
    }
    // This statement checks if the "to" calendar from the upload popup needs to be initialised.
    // Here, the difference is, that no endDate has been set, but a new startDate.
  } else if (calId === "to") {
    if ((day.getTime() < monthData.date.dateInfo.getTime() ||
        today === dayFromMonthData)) {
      dayFieldRow[column].classList.add("selectable");
    }
  }
}

/**
 * This function determins of the clicked day-filed is selectable.
 * If it is, it's value and the value of the header are read and put together to a date string.
 * This date string and the parent will be sent via an event "onDatePicked".
 */
function onDayFieldClicked(event) {
  let element = event.target,
    pickedDate,
    parent = this.calendar.parentNode,
    binary = 10;

  if (element.classList.contains("selectable")) {
    let pickedDay = parseInt(element.innerHTML),
      pickedMonth = parseInt(month.indexOf(calenderHeaderM.innerHTML) + 1),
      pickedYear = calenderHeaderY.innerHTML;

    if (pickedDay < binary) {
      pickedDay = "0" + pickedDay;
    }
    if (pickedMonth < binary) {
      pickedMonth = "0" + pickedMonth;
    }
    pickedDate = pickedYear + "-" + pickedMonth + "-" + pickedDay;
    this.notifyAll(new Event(Config.CALENDAR_VIEW.EVENT.DATE_PICKED, {
      date: pickedDate,
      parent: parent,
    }));
  }
}

class CalenderView extends Observable {
  constructor(el) {
    super();
    this.el = el;
    this.date = new Date();
    this.pickedMonth = this.date;
    initElements(this);
    initCalendar("init", null, null, getTheMonth(this.date));
  }

  // Sets the startDate variable to the selected day
  setStartDate(sD) {
    startDate = sD;
  }
  // Sets the endDate variable to the selected day
  setEndDate(eD) {
    endDate = eD;
  }

  // This initializes the startDatePicker from the UploadView
  formatStartDatePicker() {
    if (endDate === undefined) {
      initCalendar("init", null, null, getTheMonth(this.pickedMonth));
      return;
    }
    let pickedEndDate = new Date(endDate + Config.TIME_END_VALUE),
      monthData = getTheMonth(this.pickedMonth);
    initCalendar("from", null, pickedEndDate, monthData);
  }

  // This initializes the endDatePicker from the UploadView
  formatEndDatePicker() {
    if (startDate === undefined) {
      initCalendar("init", null, null, getTheMonth(this.pickedMonth));
      return;
    }
    let pickedStartDate = new Date(startDate),
      monthData = getTheMonth(this.pickedMonth),
      today = new Date();
    // if you open a post, that has been created in the past, the start date can be 
    //  already in the past. With this we make sure only dates from the current date 
    //  on can be selected.
    if (pickedStartDate < today) {
      pickedStartDate = today;
      startDate = today;
    }
    initCalendar("to", pickedStartDate, null, monthData);
  }

  // This resets the calendar.
  resetCalenders() {
    this.pickedMonth = new Date();
    startDate = undefined;
    endDate = undefined;
    monthDirection = 0;
    clearCalendar();
    initCalendar("init", null, null, getTheMonth(this.date));
  }
}

export default CalenderView;