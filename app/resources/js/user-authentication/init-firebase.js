/* eslint-env browser */

/**
 *
 * Setup connection with firebase to uitilize its functionality for User Authentication, Database and Storage
 * 
 */

const firebaseConfig = {
  apiKey: "AIzaSyB3fcSbra9tg1a9uKu9cj4bLybbaZydQrA",
  authDomain: "postingboard-14606.firebaseapp.com",
  databaseURL: "https://postingboard-14606.firebaseio.com",
  projectId: "postingboard-14606",
  storageBucket: "postingboard-14606.appspot.com",
  messagingSenderId: "227422109733",
  appId: "1:227422109733:web:c27071f9dbb9ad69",
};

// Only initialize firebase if internet connection is available
if (window.navigator.onLine) {
  /* global firebase */
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}