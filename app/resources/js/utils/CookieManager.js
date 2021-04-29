/* eslint-env browser */
import Config from "./Config.js";

/**
 * DESCRIPTION: Saves email Cookies for different usage. 
 * 1. DownloadEmail is for the send .ics file popup.
 * 2. LoginEmail is for the login popup.
 */

function getExpirationDate() {
  var today = new Date();
  today.setDate(today.getDate() + Config.COOKIE_MANAGER.COOKIE_EXPIRATION_IN_DAYS);
  return new Date(today);
}

class CookieManager {

  // Saves cookie for the last email that has been sent, or just the user mail.
  setDownloadEmailCookie(email) {
    document.cookie = "downloadEmail=" + email + ";expires=" +
      getExpirationDate();
  }

  // Saves last login email address.
  setLoginEmailCookie(email) {
    document.cookie = "loginEmail=" + email + ";expires=" +
    getExpirationDate();
  }

  // Souce: https://stackoverflow.com/questions/10730362/get-cookie-by-name
  getLoginEmailCookie() {
    return document.cookie.replace(
      Config.COOKIE_MANAGER.COOKIE_LOGIN_MAIL_REGEX, "$1");
  }
  getEmailCookieValue() {
    return document.cookie.replace(
     Config.COOKIE_MANAGER.COOKIE_DOWNLOAD_MAIL_REGEX, "$1");
  }

  // Resetting cookie by setting timestamp of now as axpiration timepoint
  resetDownloadEmailCookie() {
    document.cookie = "downloadEmail=;expires=" + new Date();
  }
  resetLoginEmailCookie() {
    document.cookie = "loginEmail=;expires=" + new Date();
  }

}

export default new CookieManager();