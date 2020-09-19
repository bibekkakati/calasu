const { query } = require("./db");

const blogTable = "blog_table";
const photoTable = "photo_table";
const timelineTable = "personal_timeline_table";

const uploadBlog = (postid, userid, title, category, timestamp) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO ${blogTable}(postid, userid, title, category, timestamp) VALUES($1, $2, $3, $4, $5)`;
    const params = [postid, userid, title, category, timestamp];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const uploadPhoto = (postid, userid, category, timestamp) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO ${photoTable}(postid, userid, category, timestamp) VALUES($1, $2, $3, $4)`;
    const params = [postid, userid, category, timestamp];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const getPostById = (postid) => {
  var q = "";
  switch (postid.substr(0, 3)) {
    case "blg":
      q = `SELECT * FROM ${blogTable} WHERE postid = ($1)`;
      break;
    case "pht":
      q = `SELECT * FROM ${photoTable} WHERE postid = ($1)`;
      break;
    default:
      break;
  }
  return new Promise((resolve, reject) => {
    const params = [postid];
    if (q) {
      query(q, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    } else {
      reject("Postid format mismatch.");
    }
  });
};

const getTimelineByUserId = (userid, offset = 0, limit = 10) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT postid, timestamp FROM ${timelineTable} WHERE userid = ($1) ORDER BY timestamp OFFSET ($2) LIMIT ($3)`;
    const params = [userid, offset, limit];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const deletePost = (userid, postid) => {
  return new Promise((resolve, reject) => {
    var q = "";
    switch (postid.substr(0, 3)) {
      case "blg":
        q = `DELETE FROM ${blogTable} WHERE postid = ($1) AND userid = ($2) RETURNING *`;
        break;
      case "pht":
        q = `DELETE FROM ${photoTable} WHERE postid = ($1) AND userid = ($2) RETURNING *`;
        break;
      default:
        break;
    }
    const params = [postid, userid];
    if (q) {
      query(q, params, (err, res) => {
        if (err) reject(err);
        else {
          deletePostFromTimeline(userid, postid);
          resolve(res);
        }
      });
    } else {
      reject("Postid format mismatch.");
    }
  });
};

const updateBlog = (userid, postid, title, category) => {
  return new Promise((resolve, reject) => {
    const q = `UPDATE ${blogTable} SET title = ($1), category = ($2) WHERE postid = ($3) AND userid = ($4)`;
    const params = [title, category, postid, userid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const updateBlogUrl = (postid, blogUrl, userid) => {
  return new Promise((resolve, reject) => {
    const q = `UPDATE ${blogTable} SET blogurl = ($1), uploaded = 1 WHERE postid = ($2)`;
    const params = [blogUrl, postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else {
        updateTimeline(postid, userid)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};

const updateBlogImageUrl = (postid, imageUrl) => {
  return new Promise((resolve, reject) => {
    const q = `UPDATE ${blogTable} SET imageurl = ($1) WHERE postid = ($2)`;
    const params = [imageUrl, postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const updatePhotoPostUrl = (postid, imageUrl, userid) => {
  return new Promise((resolve, reject) => {
    const q = `UPDATE ${photoTable} SET imageurl = ($1), uploaded = 1 WHERE postid = ($2)`;
    const params = [imageUrl, postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else {
        updateTimeline(postid, userid)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};

const updateTimeline = (postid, userid) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO ${timelineTable}(userid, postid, timestamp) VALUES($1, $2, $3)`;
    const params = [userid, postid, Date.now()];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const incrementPostViews = (postid) => {
  var q = "";
  switch (postid.substr(0, 3)) {
    case "blg":
      q = `UPDATE ${blogTable} SET views = views + 1 WHERE postid = ($1)`;
      break;
    case "pht":
      q = `UPDATE ${photoTable} SET views = views + 1  WHERE postid = ($1)`;
      break;
    default:
      break;
  }
  return new Promise((resolve, reject) => {
    const params = [postid];
    if (q) {
      query(q, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    } else {
      reject("Postid format mismatch.");
    }
  });
};

const incrementPostLikes = (postid) => {
  var q = "";
  switch (postid.substr(0, 3)) {
    case "blg":
      q = `UPDATE ${blogTable} SET likes = likes + 1 WHERE postid = ($1)`;
      break;
    case "pht":
      q = `UPDATE ${photoTable} SET likes = likes + 1  WHERE postid = ($1)`;
      break;
    default:
      break;
  }
  return new Promise((resolve, reject) => {
    const params = [postid];
    if (q) {
      query(q, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    } else {
      reject("Postid format mismatch.");
    }
  });
};

const decrementPostLikes = (postid) => {
  var q = "";
  switch (postid.substr(0, 3)) {
    case "blg":
      q = `UPDATE ${blogTable} SET likes = likes + 1 WHERE postid = ($1)`;
      break;
    case "pht":
      q = `UPDATE ${photoTable} SET likes = likes + 1  WHERE postid = ($1)`;
      break;
    default:
      break;
  }
  return new Promise((resolve, reject) => {
    const params = [postid];
    if (q) {
      query(q, params, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    } else {
      reject("Postid format mismatch.");
    }
  });
};

const insertPostToTimeline = (userid, postid) => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const q = `INSERT INTO ${timelineTable}(userid, postid, timestamp) VALUES($1, $2, $3)`;
    const params = [userid, postid, timestamp];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const deletePostFromTimeline = (userid, postid) => {
  const q = `DELETE FROM ${timelineTable} WHERE userid = ($1) AND postid = ($2)`;
  const params = [userid, postid];

  return query(q, params, (err, res) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

module.exports = {
  uploadBlog,
  getTimelineByUserId,
  getPostById,
  uploadPhoto,
  deletePost,
  updateBlog,
  incrementPostLikes,
  incrementPostViews,
  decrementPostLikes,
  insertPostToTimeline,
  deletePostFromTimeline,
  updateBlogUrl,
  updateBlogImageUrl,
  updatePhotoPostUrl,
};
