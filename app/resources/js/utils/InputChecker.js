/* eslint-env browser */
import { Event, Observable } from "../utils/Observable.js";
import Config from "./Config.js";

/**
 * 
 * InputChecker takes care of inputs that are used in the User Authentication context
 * (e.g. Registration, Login, Editing Profiledata)
 * 
 */

class InputChecker extends Observable {

  constructor() {
    super();
    this.uniEmailRegex = /\w+\.\w+@(\w+\.)*(uni-regensburg.de|ur.de)/;
    this.specialCharsRegex = /[~`!@#$%^&*()\-_+=|}\]{["':;?/>.</]/;
    this.message = "";
    this.event = undefined;
  }

  // Checks if given passwords are the same
  isSamePassword(newPassword, newPasswordRepeat) {
    if (newPassword !== newPasswordRepeat) {
      this.message = "Passwörter stimmen nicht überein.";
      this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
        field: "password",
        message: this.message,
      });
      this.notifyAll(this.event);
      return false;
    }
    return true;
  }

  // Checks if given username, email and password are valid
  checkAllChanged(changedInfo) {
    let infoBooleans = [null, null, null];
    if (changedInfo.username !== undefined) {
      infoBooleans[0] = this.isValidUsername(changedInfo.username);
    }
    if (changedInfo.email !== undefined) {
      infoBooleans[1] = this.isValidEmail(changedInfo.email);
    }
    if (changedInfo.password !== undefined && changedInfo.passwordRepeat !==
      undefined) {
      infoBooleans[2] = false;
      if (this.isSamePassword(changedInfo.password, changedInfo
          .passwordRepeat)) {
        if (this.isValidPassword(changedInfo.password) && this
          .isValidPassword(changedInfo.passwordRepeat)) {
          infoBooleans[2] = true;
        }
      }
    }
    if (changedInfo.password !== undefined && changedInfo.passwordRepeat ===
      undefined) {
      infoBooleans[2] = this.isValidPassword(changedInfo.password);
    }
    if ((infoBooleans[0] === true || infoBooleans[0] === null) && (
        infoBooleans[1] === true || infoBooleans[1] === null) && (
        infoBooleans[2] === true || infoBooleans[2] === null)) {
      let event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_DATA_CORRECT, changedInfo);
      this.notifyAll(event);
    }
  }

// Checks if the username is valid (minimum 4 characters needed)
isValidUsername(username) {
  if (username.length === 0) {
    this.message = "Feld darf nicht leer sein";
    this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
      field: "username",
      message: this.message,
    });
    this.notifyAll(this.event);
    return false;
  }
  if (username.length < 4) {
    this.message = "Benutzername muss mind. 4 Zeichen lang sein.";
    this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
      field: "username",
      message: this.message,
    });
    this.notifyAll(this.event);
    return false;
  }
  return true;
}

// Checks if given email is an email address of University of Regensburg (e.g. firstname.lastname@ur.de OR firstname.lastname@stud.uni-regensburg.de)
isValidEmail(email) {
  if (email.length === 0) {
    this.message = "Feld darf nicht leer sein";
    this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
      field: "email",
      message: this.message,
    });
    this.notifyAll(this.event);
    return false;
  }
  if (!this.uniEmailRegex.test(email)) {
    this.message = "Bitte eine Uni-Regensburg E-Mail Adresse eingeben.";
    this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
      field: "email",
      message: this.message,
    });
    this.notifyAll(this.event);
    return false;
  }
  return true;
  }

  // Checks if given password is valid
  // Extended default Firebase check to also include special characters
  isValidPassword(password) {
    if (password.length === 0) {
      this.message = "Feld darf nicht leer sein";
      this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
        field: "password",
        message: this.message,
      });
      this.notifyAll(this.event);
      return false;
    }
    if (password.length < 8) {
      this.message = "Passwort muss mind. 8 Zeichen lang sein.";
      this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
        field: "password",
        message: this.message,
      });
      this.notifyAll(this.event);
      return false;
    }
    if (!this.specialCharsRegex.test(password)) {
      this.message = "Passwort muss mind. 1 Sonderzeichen enthalten.";
      this.event = new Event(Config.INPUT_CHECKER.EVENT.INPUT_ERROR_FOUND, {
        field: "password",
        message: this.message,
      });
      this.notifyAll(this.event);
      return false;
    }
    return true;
  }
}

export default new InputChecker();