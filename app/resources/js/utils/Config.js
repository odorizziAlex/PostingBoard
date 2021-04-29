/* eslint-env browser */
const Config = {

  CALENDAR_VIEW: {
    EVENT: {
      DATE_PICKED: "datePicked",
    },
    NEXT_MONTH: "feather-chevron-right",
    PREVIOUS_MONTH: "feather-chevron-left",
    MONTH_NUM: 11,
    MAX_MONTH_DAY_NUM: 31,
  },
  DELETE_POST_POPUP_VIEW: {
    EVENT: {
      DELETE_POST_FINAL: "deletePostFinal",
    },
  },
  DELETE_PROFILE_POPUP_VIEW: {
    EVENT: {
      DELETE_PROFILE_BUTTON_CLICKED: "deleteProfileButtonClicked",
    },
  },
  DOWNLOAD_POPUP_VIEW: {
    EVENT: {
      EMAIL_SENT: "emailSent",
    },
  },
  EDIT_PROFILE_VIEW: {
    EVENT: {
      SAVE_BUTTON_CLICKED: "saveButtonClicked",
    },
  },
  FILTER_VIEW: {
    EVENT: {
      CATEGORY_CHOSEN: "categoryChosen",
      FACULTY_CHOSEN: "facultyChosen",
      RESET_FILTER_FACULTY: "resetFilterFaculty",
      RESET_FILTER_CATEGORY: "resetFilterCategory",
      RESET_FILTER_DATE: "resetFilterDate",
      ADD_BUTTON_CLICKED: "addButtonClicked",
      VERIFY_BUTTON_CLICKED: "verifyButtonClicked",
      TIME_CHECKBOX_CLICKED: "timeCheckboxChanged",
      LATEST_CHECKBOX_CHANGED: "latestCheckboxChanged",
      ORDER_CHOSEN: "orderChosen",
      RESET_FILTER_ORDER: "resetFilterOrder",
    },
    ORDER_TIME_DESCENDING: "Zeit absteigend",
    ORDER_TIME_NEWEST: "Neueste zuerst",
    ORDER_TIME_MOST_POPULAR: "Beliebteste zuerst",
  },
  FORGOT_PASSWORD_VIEW: {
    EVENT: {
      SEND_BUTTON_CLICKED: "sendButtonClicked",
    },
  },
  HEADER_VIEW: {
    EVENT: {
      LOGIN_BUTTON_CLICKED: "onloginButtonClicked",
      REGISTER_BUTTON_CLICKED: "onregisterButtonClicked",
      LOGO_CLICKED: "onlogoClicked",
    },
    HEADER_ALL_POSTS: "Alle Posts",
    HEADER_YOUR_POSTS: "Meine Posts",
    HEADER_YOUR_FAVOURITES: "Meine Favoriten",
  },
  LOGIN_VIEW: {
    EVENT: {
      LOGIN_BUTTON_CLICKED: "loginButtonClicked",
      PASSWORD_FORGOT_CLICKED: "passwordForgotClicked",
    },
  },
  MENU_VIEW: {
    EVENT: {
      EDIT_PROFILE_CLICKED: "editProfileClicked",
      DELETE_PROFILE_CLICKED: "deleteProfileClicked",
      FILTER_BY_OWN_POSTS: "filterByOwnPosts",
      FILTER_BY_FAVOURISED: "filterByFavourised",
      LOGOUT_CLICKED: "logoutClicked",
    },
  },
  POST_DETAIL_VIEW: {
    EVENT: {
      EDIT_POST: "editPost",
      DELETE_POST: "deletePost",
      IMAGE_CLICKED: "imageClicked",
      FAVOURISED_BUTTON_CLICKED: "favouriteButtonClicked",
      DOWNLOAD_BUTTON_CLICKED: "downloadButtonClicked",
    },
    MAX_FAVOUR_NUM: 1000,
    OVER_FAVOUR_MAX: "999+",
    FACULTY_COLORS: {
      "Katholische Theologie": "#ecbc00",
      "Rechtswissenschaft": "#cdd30f",
      "Wirtschaftswissenschaften": "#aea700",
      "Medizin": "#00556a",
      "PT": "#ec6200",
      "Psycho": "#bf002a",
      "Sprach.Lit": "#9c004b",
      "Mathematik": "#009b77",
      "Physik": "#008993",
      "Biologie": "#4fb800",
      "Chemie &amp; Pharmazie": "#0087b2",
      "sonstige": "#3F57F1",
    },
  },
  POST_VIEWS: {
    EVENT: {
      POST_CLICKED: "postClicked",
      LOAD_BUTTON_CLICKED: "loadButtonClicked",
      MORE_POSTS_BUTTON_CLICKED: "morePostsButtonClicked",
    },
    FACULTY_COLORS_TRANSPARENT: {
      "Katholische Theologie": "#ecbc00dd",
      "Rechtswissenschaft": "#cdd30fdd",
      "Wirtschaftswissenschaften": "#aea700dd",
      "Medizin": "#00556add",
      "PT": "#ec6200dd",
      "Psycho": "#bf002add",
      "Sprach.Lit": "#9c004bdd",
      "Mathematik": "#009b77dd",
      "Physik": "#008993dd",
      "Biologie": "#4fb800dd",
      "Chemie &amp; Pharmazie": "#0087b2dd",
      "sonstige": "#3F57F1dd",
    },
    DEFAULT_IMAGE_PATH: "../app/resources/assets/image2vector.svg",
  },
  REGISTER_VIEW: {
    EVENT: {
      REGISTER_CLICKED: "registerClicked",
    },
  },
  RESET_PASSWORD_VIEW: {
    EVENT: {
      RESET_CLICKED: "resetClicked",
    },
  },
  UPLOAD_VIEW: {
    EVENT: {
      CLOSE_BUTTON_CLICKED: "onCloseButtonClicked",
      ENTER_START_DATE: "onEnterStartDate",
      LEAVE_START_DATE: "onLeaveStartDate",
      ENTER_END_DATE: "onEnterEndDate",
      LEAVE_END_DATE: "onLeaveEndDate",
      STORE_EDITED_POST: "storeEditedPost",
      NEW_POST_CREATED: "newPostCreated",
    },
    CATEGORY_TEXT: "Kategorie auswählen",
    FACULTY_TEXT: "Fakultät auswählen",
    CLOSE_BRACKETS: ")",
    EDIT_MODE_TITLE: "Plakat bearbeiten",
    UPLOAD_MODE_TITLE: "Plakat hochladen",
    START_DATE_BUTTON_TEXT: "Von",
    END_DATE_BUTTON_TEXT: "Bis",
    FILE_WARNING: "Bitte wähle eine Datei im richtigen Format aus",
    CATEGORY_WARNING: "Bitte wähle eine Kategorie aus",
    FACULTY_WARNING: "Bitte wähle eine Fakultät aus",
    TIME_WARNING: "Bitte wähle einen Zeitraum aus",
    TITLE_WARNING: "Bitte gib einen Titel ein",
    IMAGE_FIELD_DEFAULT_BACKGROUND: "rgba(63,87,241,0.1)",
    IMAGE_FIELD_AFTER_BACKGROUND: "no-repeat center/cover url(",
    FILE_UPLOAD_DELAY: 1000,
    FILE_TYPES: ["image/png", "image/jpeg"],

  },
  INPUT_CHECKER: {
    EVENT: {
      INPUT_DATA_CORRECT: "inputDataCorrect",
      INPUT_ERROR_FOUND: "inputErrorFound",
    },
  },
  IMAGE_COMPRESSOR: {
    EVENT: {
      ERROR_ACTION: "errorAction",
    },
    COMPRESSOR_ERROR: "Bildkompression schlug fehl",
    MAX_VALUE_FOR_IMAGE: 1900,

  },
  CONNECTION_HANDLER: {
    EVENT: {
      NOW_ONLINE: "nowOnline",
      NOW_OFFLINE: "nowOffline",
    },
  },
  USER_AUTH: {
    EVENT: {
      SUCCESS_ACTION: "successAction",
      ERROR_ACTION: "errorAction",
      USER_SIGNED_IN: "userSignedIn",
      USER_SIGNED_OUT: "userSignedOut",
      NEW_PASSWORD_REQUESTED: "newPasswordRequested",
      PROFILE_DELETED: "onProfileDeleted",
    },
    VERIFICATION_MAIL_TIMEOUT: 1000,
    ERROR_CODES: {
      EXPIRED_ACTION_CODE: "auth/expired-action-code",
      INVALID_ACTION_CODE: "auth/invalid-action-code",
      USER_NOT_FOUND: "auth/user-not-found",
      USER_TOKEN_EXPIRED: "auth/user-token-expired",
      REQUIRES_RECENT_LOGIN: "auth/requires-recent-login",
      EMAIL_IN_USE: "auth/email-already-in-use",
      INVALID_EMAIL: "auth/invalid-email",
      WEAK_PASSWORD: "auth/weak-password",
      WRONG_PASSWORD: "auth/wrong-password",
      OPERATION_NOT_ALLOWED: "auth/operation-not-allowed",
      APP_DELETED: "auth/app-deleted",
      TOO_MANY_REQUESTS: "auth/too-many-requests",
    },
    MESSAGE: {
      INVALID_REQUEST: "Ihre Anfrage ist leider nicht mehr gültig. Bitte versuchen Sie es erneut.",
      INVALID_INPUT: "Ihre Eingabe ist nicht gültig.",
      USER_NOT_EXISTENT: "Dieser Nutzer existiert nicht.",
      ERROR_OCCURRED: "Ein Fehler ist aufgetreten.",
      RESET_EMAIL: "E-Mail Adresse wurde wieder zurückgesetzt. Bitte erneut anmelden.",
      RESET_PASSWORD: "Passwort wurde erfolgreich geändert.",
      VERIFY_PROFILE_SUCCESS: "Profil erfolgreich verifiziert.",
      UPDATE_USERNAME_SUCCESS: "Benutzername erfolgreich geändert.",
      UPDATE_EMAIL_SUCCESS: "E-Mail erfolgreich geändert.",
      UPDATE_PASSWORD_SUCCESS: "Passwort erfolgreich geändert.",
      REGISTER_USER_SUCCESS: "Registrierung war erfolgreich.",
      DELETE_USER_SUCCESS: "Profil wurde erfolgreich gelöscht.",
      LOGOUT_USER_SUCCESS: "Sie wurden erfolgreich ausgeloggt.",
      SEND_EMAIL_SUCCESS: "E-Mail wurde erfolgreich versendet.",
      SESSION_EXPIRED: "Aktuelle Sitzung abgelaufen. Bitte erneut anmelden.",
      EMAIL_IN_USE: "Diese E-Mail wird bereits verwendet.",
      EMAIL_NOT_VALID: "Bitte eine gültige E-Mail Adresse eingeben.",
      ACTION_NOT_VALID: "Diese Aktion ist nicht gültig.",
      STRONGER_PASSWORD: "Bitte ein stärkeres Passwort eingeben.",
      CHECK_EMAIL: "Bitte prüfe dein Email-Konto.",
      SEND_EMAIL_ERROR: "E-Mail konnte nicht versendet werden.",
      GREETING: "Guten Tag ",
    },
    ACTION: {
      VERIFIED_EMAIL: "verifiedEmail",
      UPDATE_USERNAME: "updateUsername",
      UPDATE_EMAIL: "updateEmail",
      UPDATE_PROFILE_ERROR: "updateProfileError",
      RESET_PASSWORD: "resetPassword",
      REGISTER_USER: "registerUser",
      LOGIN_USER: "loginUser",
      LOGOUT_USER: "logoutUser",
      VERIFY_EMAIL_SENT: "verifyEmailSent",
      VERIFY_EMAIL_NOT_SENT: "verifyEmailNOTSent",
      SEND_RESET_PASSWORD_EMAIL: "sendResetPasswortMail",
    },
    AUTH_MODE: {
      RESET_PASSWORD: "resetPassword",
      RECOVER_EMAIL: "recoverEmail",
      VERIFY_EMAIL: "verifyEmail",
    },
  },
  FIREBASE_DB: {
    EVENT: {
      MORE_POSTS_IN_DB: "morePostsInDB",
      ERROR_ACTION: "errorAction",
      APP_STARTED: "onAppStarted",
      NEW_POST_STORED_IN_DB: "newPostStoredInDB",
      POST_UPDATED_IN_DB: "postUpdatedInDB",
      FAVOURISATION_FAILED: "favourisationFailed",
      POST_DELETED: "postsDeleted",
      POST_DELETED_FROM_DB: "postDeletedFromDB",
    },
    DB_LISTENER_ERROR: "Es gibt ein Problem mit dem Server",
    FILE_TYPE: "blob",
    FILE_REQUEST_CODE: 200,
    FILE_ERROR: "Laden der Datei schlug fehl",
    GET: "GET",
    DB_LOAD_ERROR: "Datenbankabfrage fehlgeschlagen. Versuche es später erneut.",
    DB_POSTS_DELETION_FAIL: "Löschen der User-Posts fehlgeschlafen",
    DB_DELETE_ERROR: "Löschen fehlgeschlagen",

  },
  POSTS_CONTROLLER: {
    EVENT: {
      POST_CLICKED: "postClicked",
      REFRESH_POST: "onRefreshPosts",
    },
  },
  DATE_CHECKER: {
    PADSTART_VALUE: 2,
    PADSTART_STRING: "0",
    DASH: "-",
    POINT: ".",
  },
  TOAST_VIEW: {
    TOAST_DELAY: 3000,
  },
  COOKIE_MANAGER: {
    COOKIE_EXPIRATION_IN_DAYS: 30,
    COOKIE_LOGIN_MAIL_REGEX: /(?:(?:^|.*;\s*)loginEmail\s*\=\s*([^;]*).*$)|^.*$/,
    COOKIE_DOWNLOAD_MAIL_REGEX: /(?:(?:^|.*;\s*)downloadEmail\s*\=\s*([^;]*).*$)|^.*$/,
  },
  POSTS_MODEL: {
    POST_NUM_FOR_LOAD_BUTTON: 12,
  },

  //GLOBAL CONFIG TERMS
  EMPTY_STRING: "",
  ALL_FACULTIES: "Alle Fakultäten",
  ALL_DATES: "Beliebiger Zeitraum",
  ALL_CATEGORIES: "Alle Kategorien",
  ORIGINAL_ORDER: "Keine Reihenfolge",
  DB_ADD_ERROR: "Eintrag in die Datenbank fehlgeschlagen",
  ENTER_BUTTON_KEY_CODE: 13,
  ESC_BUTTON_KEY_CODE: 27,
  TIME_END_VALUE: "T23:59:59",

  // INDEX
  DB_FAV_ERROR: "Favorisieren fehlgeschlagen",
  NO_INTERNET_CONNECTION_TITLE: "Keine Verbindung zum Internet...",
  NO_INTERNET_CONNECTION_MSG: "Computer ist offline.",
  CONNECTION_LOST_TITLE: "Verbindung verloren...",
  CONNECTION_LOST_MSG: "Prüfe deine Internetverbindung.",
};

Object.freeze(Config);

export default Config;