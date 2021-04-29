/* eslint-env browser */

class Post {

  constructor(title, start, end, category, faculty, file, userId, favourites,
    id) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.category = category;
    this.faculty = faculty;
    this.file = file;
    this.userId = userId;
    //list of userIds, who favoured the post
    this.favourites = favourites || [];
    //id is always unique this way
    this.id = id || Date.now().toString();
  }

}

export default Post;