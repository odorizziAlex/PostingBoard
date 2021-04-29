/* eslint-env browser */
import Config from "../utils/Config.js";

var currentCategory = Config.ALL_CATEGORIES,
  currentFaculty = Config.ALL_FACULTIES,
  currentDate = Config.ALL_DATES,
  currentOrder = Config.ORIGINAL_ORDER,
  numOfMaxPosts = Config.POSTS_MODEL.POST_NUM_FOR_LOAD_BUTTON,
  ownPostsFilterChecked = false,
  currentUserId = Config.EMPTY_STRING,
  favouritesFilterChecked = false,
  allPosts = [],
  initialList = [];

//Fills list depending on values of variables representing the state of filtering  
function getFilteredList() {
  let list = [],
    filter = true;
  //testing all posts in allPosts  
  for (let i = 0; i < allPosts.length; i++) {
    let post = allPosts[i];
    //concatenates booleans to test whether a post should be pushed to list or not
    if (currentCategory !== Config.ALL_CATEGORIES) {
      filter = filter && post.category === currentCategory;
    }
    if (currentFaculty !== Config.ALL_FACULTIES) {
      filter = filter && post.faculty === currentFaculty;
    }
    if (currentDate !== Config.ALL_DATES) {
      filter = filter && dateIsInRange(post.start, currentDate, post.end);
    }
    if (ownPostsFilterChecked) {
      filter = filter && post.userId === currentUserId;
    }
    if (favouritesFilterChecked) {
      filter = filter && post.favourites.includes(currentUserId);
    }
    //true if all booleans are true
    if (filter) {
      list.push(post);
    }
    filter = true;
  }
  return orderList(list);
}

function orderList(list) {
  let indexTop, temp, dateTop, dateJ;
  if (currentOrder === Config.FILTER_VIEW.ORDER_TIME_DESCENDING) {
    //orders list descending by time (first by startdate then by enddate) -> 01.10.19-01.11.19 has a higher index than 01.10.19-01.10.19
    for (let i = 0; i < list.length; i++) {
      indexTop = i;
      for (let j = i + 1; j < list.length; j++) {
        dateTop = new Date(list[indexTop].start).getTime();
        dateJ = new Date(list[j].start).getTime();
        if (dateTop > dateJ || (dateTop === dateJ && new Date(list[indexTop]
            .end).getTime() > new Date(list[j].end).getTime())) {
          indexTop = j;
        }
      }
      temp = list[i];
      list[i] = list[indexTop];
      list[indexTop] = temp;
    }
  }
  if (currentOrder === Config.FILTER_VIEW.ORDER_TIME_NEWEST) {
    //Newest stored posts first in list, because list is ordered the way the posts were stored in db
    let reverseList = list.reverse();
    return reverseList;
  }
  if (currentOrder === Config.FILTER_VIEW.ORDER_TIME_MOST_POPULAR) {
    //post with most likes first
    list.sort(function(a, b) {
      return b.favourites.length - a.favourites.length;
    });
  }
  return list;
}

//https://wiki.base22.com/btg/how-to-compare-dates-in-javascript-81791002.html changes made
//filter for time
function dateIsInRange(start, current, end) {
  let date = new Date(current).getTime();
  if (new Date(start).getTime() <= date && date <= new Date(end).getTime()) {
    return true;
  }
  return false;
}

function randomizeList(list) {
  //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array minor changes made
  //shuffles the array
  let j;
  for (let i = list.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }

}

function resetMaxPosts() {
  numOfMaxPosts = Config.POSTS_MODEL.POST_NUM_FOR_LOAD_BUTTON;
}

function getIndexInList(postId, list) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === postId) {
      return i;
    }
  }
  return list.length - 1;
}

function deleteFromList(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list.splice(i, 1);
    }
  }
}

//Logic behind showing posts in postsview and place to store/delete/update posts without using the database -> faster filtering...
class PostsModel {

  addPost(post) {
    allPosts.push(post);
    initialList.push(post);
  }

  //replaces/updates post in both lists
  replacePost(post) {
    let id = post.id;
    allPosts.splice(getIndexInList(id, allPosts), 1, post);
    initialList.splice(getIndexInList(id, initialList), 1, post);
  }

  //sets allPosts and initialList. orders initialList randomly
  initialPostsList(list) {
    allPosts = list;
    initialList = list.slice(0);
    randomizeList(initialList);
  }

  getRandomizedList() {
    return initialList;
  }

  //Following 6 functions set specific filter, resets maximum of posts (not all posts are shown denpending on length of list)
  getSortedListByCategory(category) {
    currentCategory = category;
    resetMaxPosts();
    return this.getNeededList();
  }

  getSortedListByFaculty(faculty) {
    currentFaculty = faculty;
    resetMaxPosts();
    return this.getNeededList();
  }

  getSortedListByDate(date) {
    currentDate = date;
    resetMaxPosts();
    return this.getNeededList();
  }

  getSortedListByOrder(order) {
    currentOrder = order;
    resetMaxPosts();
    return this.getNeededList();
  }

  //Following 2 functions sets userid (important for user specific filtering) and sets other boolean false (its not possible to filter for own and favoured posts)
  getListOnOwnPostsClicked(checked, userId) {
    ownPostsFilterChecked = checked;
    currentUserId = userId;
    resetMaxPosts();
    favouritesFilterChecked = false;
    return this.getNeededList();
  }

  getListOnFavouritesClicked(checked, userId) {
    favouritesFilterChecked = checked;
    currentUserId = userId;
    resetMaxPosts();
    ownPostsFilterChecked = false;
    return this.getNeededList();
  }

  //returns the right list for displaying
  getNeededList() {
    let hasNoFilter = currentCategory === Config.ALL_CATEGORIES &&
      currentFaculty === Config.ALL_FACULTIES &&
      currentDate === Config.ALL_DATES &&
      !ownPostsFilterChecked &&
      !favouritesFilterChecked,
      hasOriginalOrder = currentOrder === Config.ORIGINAL_ORDER;
    //No Filter at all ("Keine Reihenfolge" is no Filter)  -> returns intiallist (the same randomized list)
    if (hasNoFilter && hasOriginalOrder) {
      return initialList;
    }
    //No Filter but order is not default -> return list depending on "Keine Reihenfolge"-dropdown
    if (hasNoFilter) {
      //copy of allPosts
      return orderList(allPosts.slice(0));
    }
    //some filter is set
    return getFilteredList();
  }

  getPostDataById(id) {
    let postId = id;
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].id === postId) {
        return allPosts[i];
      }
    }
    return null;
  }

  getFavouriteModeState() {
    return favouritesFilterChecked;
  }

  //sets copy of list`s length to numOfMaxPosts in case list length is to long to display for our displaying logic (max. 12 posts in the beginning -> max. 24 posts...). Returns the trimmed list.
  getTrimmedList(list) {
    let newList = list.slice(0);
    if (newList.length > numOfMaxPosts) {
      newList.length = numOfMaxPosts;
    }
    return newList;
  }

  //after increasing, 12 more posts can be displayed
  increasePostMax() {
    numOfMaxPosts += Config.POSTS_MODEL.POST_NUM_FOR_LOAD_BUTTON;
  }

  //pushs userid of user, who favoured a post, to posts list of users who favoured the post
  setPostAsFavourite(post, currentUserId) {
    let favourites = post.favourites;
    if (!favourites.includes(currentUserId)) {
      favourites.push(currentUserId);
    }
  }

  //removes userid of user, who favoured a post, to posts list of users who favoured the post
  unsetPostAsFavourite(post, currentUserId) {
    let favourites = post.favourites;
    if (favourites.includes(currentUserId)) {
      for (let i = 0; i < favourites.length; i++) {
        if (favourites[i] === currentUserId) {
          favourites.splice(i, 1);
          return;
        }
      }
    }
  }

  //deletes post from both lists
  deletePost(id) {
    deleteFromList(allPosts, id);
    //Only one loop throws error: initialList at index is undefined
    deleteFromList(initialList, id);
  }

  //resets variables for filtering and the number of posts to show
  resetVariables() {
    currentCategory = Config.ALL_CATEGORIES;
    currentFaculty = Config.ALL_FACULTIES;
    currentDate = Config.ALL_DATES;
    currentOrder = Config.ORIGINAL_ORDER;
    currentUserId = Config.EMPTY_STRING;
    ownPostsFilterChecked = false;
    favouritesFilterChecked = false;
    resetMaxPosts();
  }
}

export default PostsModel;