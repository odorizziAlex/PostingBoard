/* eslint-env browser */
import { Event, Observable } from "../utils/Observable.js";
import ConnectionHandler from "../utils/ConnectionHandler.js";
import Config from "../utils/Config.js";
let event, message, action;

// Keep track of status of user
function checkUserStatus(auth) {
  /* global firebase */
  firebase.default.auth().onAuthStateChanged(function(user) {
    if (user) {
      user.reload();
      // User is signed in
      auth.user = user;
      event = new Event(Config.USER_AUTH.EVENT.USER_SIGNED_IN, user);
      auth.notifyAll(event);
    } else {
      // User is not signed in
      event = new Event(Config.USER_AUTH.EVENT.USER_SIGNED_OUT, user);
      auth.notifyAll(event);
    }
  });

}
// From https://firebase.google.com/docs/auth/custom-email-handler
function handleEmailActions(auth) {
  let url = window.location.href,
    regexMode = /(?:mode=)([\w-]*)/,
    regexActionCode = /(?:oobCode=)([\w-]*)/;
  auth.mode = url.match(regexMode);
  auth.actionCode = url.match(regexActionCode);
  if (auth.mode !== null) {
    auth.mode = auth.mode[1];
  }
  if (auth.actionCode !== null) {
    auth.actionCode = auth.actionCode[1];
  }
  switch (auth.mode) {
    case Config.USER_AUTH.AUTH_MODE.RESET_PASSWORD:
      handleResetPassword(auth);
      break;
    case Config.USER_AUTH.AUTH_MODE.RECOVER_EMAIL:
      handleRecoverEmail(auth);
      break;
    case Config.USER_AUTH.AUTH_MODE.VERIFY_EMAIL:
      handleVerifyEmail(auth);
      break;
    default:
      // Error: invalid mode.
  }
}

function initUserAuth(auth) {
  if (ConnectionHandler.isConnected()) {
    checkUserStatus(auth);
    handleEmailActions(auth);
  }
}

// Check if request to reset the password is valid
function handleResetPassword(auth) {
  firebase.default.auth().verifyPasswordResetCode(auth.actionCode)
    .then(() => {
      event = new Event(Config.USER_AUTH.EVENT.NEW_PASSWORD_REQUESTED, auth
        .actionCode);
      auth.notifyAll(event);
    }).catch((error) => {
      switch (error.code) {
        case Config.USER_AUTH.ERROR_CODES.EXPIRED_ACTION_CODE:
          message =
            Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
          break;
        case Config.USER_AUTH.ERROR_CODES.INVALID_ACTION_CODE:
          message =
            Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
          break;
        case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
          message = Config.USER_AUTH.MESSAGE.USER_NOT_EXISTENT;
          break;
        default:
          message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
      }
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message });
      auth.notifyAll(event);
    });
}

// Undo email address change if unwanted
function handleRecoverEmail(auth) {
  firebase.default.auth().checkActionCode(auth.actionCode).then(() => {
    return firebase.default.auth().applyActionCode(auth.actionCode);
  }).then(() => {
    message =
      Config.USER_AUTH.MESSAGE.RESET_EMAIL;
    event = new Event(Config.USER_AUTH.EVENT
    .SUCCESS_ACTION, { message: message });
    auth.notifyAll(event);
    window.history.replaceState({}, document.title, "/app");
    firebase.default.auth().signOut();
  }).catch((error) => {
    switch (error.code) {
      case Config.USER_AUTH.ERROR_CODES.USER_TOKEN_EXPIRED:
        // 
        break;
      case Config.USER_AUTH.ERROR_CODES.EXPIRED_ACTION_CODE:
        message =
          Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
        break;
      case Config.USER_AUTH.ERROR_CODES.INVALID_ACTION_CODE:
        message =
          Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
        break;
      case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
        message = Config.USER_AUTH.MESSAGE.USER_NOT_EXISTENT;
        break;
      default:
        message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
    }
    event = new Event(Config.USER_AUTH.EVENT
    .ERROR_ACTION, { message: message });
    auth.notifyAll(event);
  });
}

// Checkif request to verify email is valid
function handleVerifyEmail(auth) {
  firebase.default.auth().applyActionCode(auth.actionCode).then(() => {
    // Email address has been verified.
    message = Config.USER_AUTH.MESSAGE.VERIFY_PROFILE_SUCCESS;
    event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
      message: message,
      action: Config.USER_AUTH.ACTION.VERIFIED_EMAIL,
    });
    auth.notifyAll(event);
    window.history.replaceState({}, document.title, "/app");
  }).catch((error) => {
    switch (error.code) {
      case Config.USER_AUTH.ERROR_CODES.EXPIRED_ACTION_CODE:
        message =
          Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
        break;
      case Config.USER_AUTH.ERROR_CODES.INVALID_ACTION_CODE:
        message =
          Config.USER_AUTH.MESSAGE.INVALID_REQUEST;
        break;
      case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
        message = Config.USER_AUTH.MESSAGE.USER_NOT_EXISTENT;
        break;
      default:
        message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
    }
    event = new Event(Config.USER_AUTH.EVENT
    .ERROR_ACTION, { message: message });
    auth.notifyAll(event);
  });
}
/**
 * 
 * Takes care of whole user authentication process (e.g. registering, login, logout and editing profile data)
 * Utilizes FirebaseAuth
 * 
 */

class UserAuth extends Observable {
  constructor() {
    super();
    this.actionCode = undefined;
    this.mode = undefined;
    this.user = undefined;
    this.userExists = false;
    initUserAuth(this);
  }

  // Update exiting username with new one set
  updateUsername(newUsername) {
    this.user.updateProfile({ displayName: newUsername }).then(() => {
      message = Config.USER_AUTH.MESSAGE.UPDATE_USERNAME_SUCCESS;
      event = new Event(Config.USER_AUTH.EVENT
      .SUCCESS_ACTION, { message: message, action: Config.USER_AUTH.ACTION.UPDATE_USERNAME,
        fieldData: newUsername });
      this.notifyAll(event);
    }).catch((error) => {
      switch (error.code) {
        case Config.USER_AUTH.ERROR_CODES.REQUIRES_RECENT_LOGIN:
          firebase.default.auth().signOut();
          message = Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
          break;
        default:
          message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
      }
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message });
      this.notifyAll(event);
    });
  }

  // Update exiting email with new one set
  updateEmail(newEmail) {
    this.user.updateEmail(newEmail).then(() => {
      message = Config.USER_AUTH.MESSAGE.UPDATE_EMAIL_SUCCESS;
      event = new Event(Config.USER_AUTH.EVENT
      .SUCCESS_ACTION, { message: message, action: Config.USER_AUTH.ACTION.UPDATE_EMAIL,
        fieldData: newEmail });
      this.notifyAll(event);
    }).catch((error) => {
      switch (error.code) {
        case Config.USER_AUTH.ERROR_CODES.REQUIRES_RECENT_LOGIN:
          firebase.default.auth().signOut();
          action = Config.USER_AUTH.ACTION.UPDATE_PROFILE_ERROR;
          message = Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
          break;
        case Config.USER_AUTH.ERROR_CODES.EMAIL_IN_USE:
          message = Config.USER_AUTH.MESSAGE.EMAIL_IN_USE;
          break;
        default:
          message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
      }
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message, action: action });
      this.notifyAll(event);

    });
  }

  // Update exiting password with new one set
  updatePassword(newPassword) {
    this.user.updatePassword(newPassword).then(() => {
      message = Config.USER_AUTH.MESSAGE.UPDATE_PASSWORD_SUCCESS;
      event = new Event(Config.USER_AUTH.EVENT
      .SUCCESS_ACTION, { message: message });
      this.notifyAll(event);
    }).catch((error) => {
      switch (error.code) {
        case Config.USER_AUTH.ERROR_CODES.REQUIRES_RECENT_LOGIN:
          firebase.default.auth().signOut();
          action = Config.USER_AUTH.ACTION.UPDATE_PROFILE_ERROR;
          message = Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
          break;
        default:
          message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
      }
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message, action: action });
      this.notifyAll(event);
    });
  }

  // Reset Password when user forgot it
  resetPassword(newPassword) {
    firebase.default.auth().confirmPasswordReset(this.actionCode.toString(),
      newPassword).then(() => {
      message = Config.USER_AUTH.MESSAGE.RESET_PASSWORD;
      event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
        message: message,
        action: Config.USER_AUTH.ACTION.RESET_PASSWORD,
      });
      this.notifyAll(event);
    }).catch((error) => {
      switch (error.code) {
        case Config.USER_AUTH.ERROR_CODES.EXPIRED_ACTION_CODE:
          message =
            Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
          break;
        case Config.USER_AUTH.ERROR_CODES.INVALID_ACTION_CODE:
          message =
            Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
          break;
        case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
          message = Config.USER_AUTH.MESSAGE.USER_NOT_EXISTENT;
          break;
        case Config.USER_AUTH.ERROR_CODES.WEAK_PASSWORD:
          message = Config.USER_AUTH.MESSAGE.STRONGER_PASSWORD;
          break;
        default:
          message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
      }
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message });
      this.notifyAll(event);
    });
  }

  // Return currently logged in user
  getCurrentUser() {
    return firebase.default.auth().currentUser;
  }

  // Return id of currently logged in user
  getUserId() {
    return firebase.default.auth().currentUser.uid;
  }

  // Register a new user with username, email and password
  registerUser(username, email, password) {
    firebase.default.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.updateProfile({
          displayName: username,
        });
        message = Config.USER_AUTH.MESSAGE.REGISTER_USER_SUCCESS;
        event = new Event(Config.USER_AUTH.EVENT
        .SUCCESS_ACTION, { action: Config.USER_AUTH.ACTION.REGISTER_USER });
        this.notifyAll(event);
      }).catch((error) => {
        switch (error.code) {
          case Config.USER_AUTH.ERROR_CODES.EMAIL_IN_USE:
            message = Config.USER_AUTH.MESSAGE.EMAIL_IN_USE;
            break;
          case Config.USER_AUTH.ERROR_CODES.INVALID_EMAIL:
            message = Config.USER_AUTH.MESSAGE.EMAIL_NOT_VALID;
            break;
          case Config.USER_AUTH.ERROR_CODES.USER_TOKEN_EXPIRED:
            message = Config.USER_AUTH.MESSAGE.ACTION_NOT_VALID;
            break;
          case Config.USER_AUTH.ERROR_CODES.OPERATION_NOT_ALLOWED:
            message = Config.USER_AUTH.MESSAGE.ACTION_NOT_VALID;
            break;
          case Config.USER_AUTH.ERROR_CODES.WEAK_PASSWORD:
            message = Config.USER_AUTH.MESSAGE.STRONGER_PASSWORD;
            break;
          default:
            message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
        }
        event = new Event(Config.USER_AUTH.EVENT
        .ERROR_ACTION, { message: message });
        this.notifyAll(event);
      });
  }

  // Send email to verify the new profile
  sendVerificationEmail() {
    // Send verification email if user is not verified
    setTimeout(() => {
      this.user.sendEmailVerification().then(() => {
        message = Config.USER_AUTH.MESSAGE.CHECK_EMAIL;
        event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
          message: message,
          action: Config.USER_AUTH.ACTION.VERIFY_EMAIL_SENT,
        });
        this.notifyAll(event);
      }).catch((error) => {
        switch (error.code) {
          case Config.USER_AUTH.ERROR_CODES.APP_DELETED:
            message = Config.USER_AUTH.MESSAGE.SEND_EMAIL_ERROR;
            break;
          case Config.USER_AUTH.ERROR_CODES.TOO_MANY_REQUESTS:
            message = Config.USER_AUTH.MESSAGE.SEND_EMAIL_ERROR;
            break;
          default:
            message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
            break;
        }

        event = new Event(Config.USER_AUTH.EVENT.ERROR_ACTION, {
          message: message,
          action: Config.USER_AUTH.ACTION.VERIFY_EMAIL_NOT_SENT,
        });
        this.notifyAll(event);
      });
    }, Config.USER_AUTH.VERIFICATION_MAIL_TIMEOUT);
  }

  // Delete the currently logged in user
  deleteUser() {
    let user = this.getCurrentUser(),
      id = this.getUserId();
    user.delete().then(() => {
      message = Config.USER_AUTH.MESSAGE.DELETE_USER_SUCCESS;
      event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
        message: message,
      });
      this.notifyAll(new Event(Config.USER_AUTH.EVENT.PROFILE_DELETED,
        id));
      this.notifyAll(event);
    }).catch(() => {
      firebase.default.auth().signOut();
      message = Config.USER_AUTH.MESSAGE.SESSION_EXPIRED;
      event = new Event(Config.USER_AUTH.EVENT
      .ERROR_ACTION, { message: message });
      this.notifyAll(event);
    });
  }

  // Check if user exists for given email
  async isUser(email) {
    await firebase.default.auth().fetchSignInMethodsForEmail(email).then((
      signInMethods) => {
      if (signInMethods.length > 0) {
        this.userExists = true;
      } else {
        this.userExists = false;
      }
    }).catch(() => {
      this.userExists = false;
    });
  }

  // Login user by email and password
  loginUser(email, password) {
    firebase.default.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        message = Config.USER_AUTH.MESSAGE.GREETING + user.user.displayName;
        event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
          message: message,
          action: Config.USER_AUTH.ACTION.LOGIN_USER,
        });
        this.notifyAll(event);
      })
      .catch((error) => {
        switch (error.code) {
          case Config.USER_AUTH.ERROR_CODES.WRONG_PASSWORD:
            message = Config.USER_AUTH.MESSAGE.INVALID_INPUT;
            break;
          case Config.USER_AUTH.ERROR_CODES.INVALID_EMAIL:
            message = Config.USER_AUTH.MESSAGE.INVALID_INPUT;
            break;
          case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
            message = Config.USER_AUTH.MESSAGE.INVALID_INPUT;
            break;
          default:
            message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
        }
        event = new Event(Config.USER_AUTH.EVENT
        .ERROR_ACTION, { message: message });
        this.notifyAll(event);
      });
  }

  // Logout currently logged in user
  logoutUser() {
    firebase.default.auth().signOut()
      .then(() => {
        message = Config.USER_AUTH.MESSAGE.LOGOUT_USER_SUCCESS;
        event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
          message: message,
          action: Config.USER_AUTH.ACTION.LOGOUT_USER,
        });
        this.notifyAll(event);
      });
  }

  // Send email if user wants to reset their email
  sendResetPasswordMail(email) {
    firebase.default.auth().sendPasswordResetEmail(email)
      .then(() => {
        message = Config.USER_AUTH.MESSAGE.SEND_EMAIL_SUCCESS;
        event = new Event(Config.USER_AUTH.EVENT.SUCCESS_ACTION, {
          message: message,
          action: Config.USER_AUTH.ACTION.SEND_RESET_PASSWORD_EMAIL,
        });
        this.notifyAll(event);
      })
      .catch((error) => {
        switch (error.code) {
          case Config.USER_AUTH.ERROR_CODES.INVALID_EMAIL:
            message = Config.USER_AUTH.MESSAGE.EMAIL_NOT_VALID;
            break;
          case Config.USER_AUTH.ERROR_CODES.USER_NOT_FOUND:
            message = Config.USER_AUTH.MESSAGE.USER_NOT_EXISTENT;
            break;
          default:
            message = Config.USER_AUTH.MESSAGE.ERROR_OCCURRED;
        }
        event = new Event(Config.USER_AUTH.EVENT
        .ERROR_ACTION, { message: message });
        this.notifyAll(event);
      });
  }
}

export default new UserAuth();