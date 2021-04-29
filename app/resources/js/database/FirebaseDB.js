/* eslint-env browser */
import Post from "../utils/Post.js";
import { Event, Observable } from "../utils/Observable.js";
import ConnectionHandler from "../utils/ConnectionHandler.js";
import Config from "../utils/Config.js";

var currentPostNum = 0;

//All the code is inspired by the Firestore documentation (https://firebase.google.com/docs/firestore) and Storage documentation https://firebase.google.com/docs/storage/web/start

function initListener(wrapper) {
  //Listener for DB changes
  wrapper.database.collection("posts").onSnapshot(function(snapshot) {
    //represents number of posts 
    let size = snapshot.size;
    if (size > currentPostNum) {
      //someone else stored a new post
      wrapper.notifyAll(new Event(Config.FIREBASE_DB.EVENT
        .MORE_POSTS_IN_DB));
    }
    currentPostNum = size;
    //error callback  
  }, function() {
    sendError(wrapper, Config.FIREBASE_DB.DB_LISTENER_ERROR);
  });
}

function initFirebaseDB(wrapper) {
  if (ConnectionHandler.isConnected()) {
    /* global firebase */
    wrapper.database = firebase.firestore();
    wrapper.storage = firebase.storage();
    wrapper.initPosts(wrapper);
    initListener(wrapper);
  }
}

//sends error message (toastView)
function sendError(wrapper, message) {
  wrapper.notifyAll(new Event(Config.FIREBASE_DB.EVENT
    .ERROR_ACTION, { message: message }));
}

//Creates an Blob file for an specific post
function getPostFile(wrapper, id) {
  let storageRef = wrapper.storage.ref().child(id);
  //returns the file on succes. returns undefined on failure
  return storageRef.getDownloadURL().then((url) => {
    // https://github.com/mdn/js-examples/blob/master/promises-test/index.html minor changes were made
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.responseType = Config.FIREBASE_DB.FILE_TYPE;
      xhr.addEventListener("load", function() {
        if (xhr.status === Config.FIREBASE_DB.FILE_REQUEST_CODE) {
          resolve(xhr.response);
        } else {
          reject(Config.FIREBASE_DB.FILE_ERROR);
        }
      });
      xhr.open(Config.FIREBASE_DB.GET, url);
      xhr.send();
    });
  }).catch(() => {
    sendError(wrapper, Config.FIREBASE_DB.FILE_ERROR);
    return undefined;
  });
}

//Deletes all old posts, when app starts, reloads, user is logged out
function deletePostsOnInit(wrapper, list) {
  if (list.length !== 0) {
    let storageRef,
      dbRef;
    list.forEach(function(id) {
      storageRef = wrapper.storage.ref().child(id);
      storageRef.delete().then(() => {
        dbRef = wrapper.database.collection("posts").doc(id);
        dbRef.delete();
      }).catch(() => {
        sendError(wrapper, Config.FIREBASE_DB.DB_LOAD_ERROR);
      });
    });
  }
}

//Fills two lists of posts from the DB: one for posts, which are still up to date; another one for posts, which have to be deleted
function getPosts(wrapper) {
  //returns to these two lists one success or two empty lists on failure
  return wrapper.database.collection("posts").get().then((querySnapshot) => {
    let posts = [],
      postsForDeletion = [],
      endDate,
      id;
    querySnapshot.forEach(function(doc) {
      id = doc.id;
      endDate = doc.data().end;
      //True, if post is not in the past
      if (new Date(endDate + Config.TIME_END_VALUE).getTime() >=
        new Date().getTime()) {
        let post = new Post(doc.data().title, doc.data().start,
          endDate, doc.data().category, doc.data().faculty, undefined,
          doc.data().userId, doc.data().favourites, id);
        posts.push(post);
      } else {
        postsForDeletion.push(id);
      }
    });
    currentPostNum = posts.length + postsForDeletion.length;
    return { posts: posts, postsForDeletion: postsForDeletion };
  }).catch(() => {
    sendError(wrapper, Config.FIREBASE_DB.DB_LOAD_ERROR);
    return { posts: [], postsForDeletion: [] };
  });
}

//Sets file for every post
async function setPostFile(wrapper, posts) {
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i],
      file = await getPostFile(wrapper, post.id);
    post.file = file;
  }
}

class FireBaseDB extends Observable {

  constructor() {
    super();
    initFirebaseDB(this);
  }

  //Gets list of posts in DB, sets its files
  async initPosts() {
    var result = await getPosts(this);
    await setPostFile(this, result.posts);
    this.notifyAll(new Event(Config.FIREBASE_DB.EVENT.APP_STARTED, result
      .posts));
    //deletes old posts
    deletePostsOnInit(this, result.postsForDeletion);
  }

  //Function to store and update posts (image file in storage)
  writePostData(post, isNewPost) {
    let event,
      storageRef = this.storage.ref().child(post.id),
      data = {
        title: post.title,
        start: post.start,
        end: post.end,
        category: post.category,
        faculty: post.faculty,
        userId: post.userId,
        favourites: post.favourites,
      };
    if (isNewPost) {
      //storing new post -> currentPostNum increases
      currentPostNum++;
      event = new Event(Config.FIREBASE_DB.EVENT.NEW_POST_STORED_IN_DB, post);
    } else {
      //updating a post
      event = new Event(Config.FIREBASE_DB.EVENT.POST_UPDATED_IN_DB, post);
    }
    storageRef.put(post.file).then(() => {
      this.database.collection("posts").doc(post.id).set(data).then(
        () => {
          this.notifyAll(event);
        });
    }).catch(() => {
      if (event.type === Config.FIREBASE_DB.EVENT.NEW_POST_STORED_IN_DB) {
        //storing new post failed -> currentPostNum decreases
        currentPostNum--;
      }
      sendError(this, Config.DB_ADD_ERROR);
    });
  }

  //Updates list of users, who favoured the post
  favourPost(post) {
    this.database.collection("posts").doc(post.id).set({
      favourites: post
        .favourites,
    }, { merge: true }).catch(() => {
      this.notifyAll(new Event(Config.FIREBASE_DB.EVENT
        .FAVOURISATION_FAILED, post));
    });
  }

  //Is triggered if current user deletes account
  deleteUserActions(userId) {
    this.database.collection("posts").where("userId", "==", userId).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //deletes own posts of user
          this.storage.ref().child(doc.id).delete();
          doc.ref.delete();
        });
        this.database.collection("posts").where("favourites",
          "array-contains", userId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let fav = doc.data().favourites;
            for (let i = 0; i < fav.length; i++) {
              if (fav[i] === userId) {
                //removes favouring of user, who deletes account
                fav.splice(i, 1);
              }
            }
            //updates list of users, who favoured this specific post
            doc.ref.update({
              favourites: fav,
            });
          });
          this.notifyAll(new Event(Config.FIREBASE_DB.EVENT
            .POST_DELETED));
        });
      }).catch(() => {
        sendError(this, Config.FIREBASE_DB.DB_POSTS_DELETION_FAIL);
      });
  }

  //Deletes post in database and storage
  deletePost(id) {
    //decreases currentPostNum
    currentPostNum--;
    let storageRef = this.storage.ref().child(id);
    storageRef.delete().then(() => {
      this.database.collection("posts").doc(id).delete().then(() => {
        this.notifyAll(new Event(Config.FIREBASE_DB.EVENT
          .POST_DELETED_FROM_DB, id));
      });
    }).catch(() => {
      //Failure -> increases currentPostNum
      currentPostNum++;
      sendError(this, Config.FIREBASE_DB.DB_DELETE_ERROR);
    });
  }
}

export default new FireBaseDB();