/* eslint-env browser */
import Config from "./Config.js";

//module for dates
class DateChecker {

  //returns a date in german format
  getGermanDateFormat(date) {
    let values = date.split(Config.DATE_CHECKER.DASH),
      result = Config.EMPTY_STRING;
    for (let i = values.length - 1; i >= 0; i--) {
      result += values[i];
      if (i !== 0) {
        result += Config.DATE_CHECKER.POINT;
      }
    }
    return result;
  }
}

export default new DateChecker();