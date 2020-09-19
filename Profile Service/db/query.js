const { query } = require("./db");

const dbInsert = {
  user_profile_table: (
    userid,
    username,
    mailid,
    name,
    picture = "",
    created_at,
    last_updated
  ) => {
    return new Promise((resolve, reject) => {
      query(
        "INSERT INTO user_profile_table(userid, username, mailid, name, picture, created_at, last_updated) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [userid, username, mailid, name, picture, created_at, last_updated],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
};

const dbUpdate = {
  user_profile_table: (userid, name) => {
    var last_updated = Date.now();
    return new Promise((resolve, reject) => {
      query(
        "UPDATE user_profile_table SET name = ($1), last_updated = ($2) WHERE userid = ($3)",
        [name, last_updated, userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  incr_followers: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET followers = followers + 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  incr_followings: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET followings = followings + 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  decr_followers: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET followers = followers - 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  decr_followings: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET followings = followings - 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  incr_likes: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET likes = likes + 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  decr_likes: (userid, value = -1) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET likes = likes - ($2) WHERE userid = ($1)`,
        [userid, value],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  incr_posts: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET posts = posts + 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  decr_posts: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET posts = posts - 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  incr_views: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET views = views + 1 WHERE userid = ($1)`,
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },

  delete_views: (userid, value) => {
    return new Promise((resolve, reject) => {
      query(
        `UPDATE user_profile_table SET views = views - ($2) WHERE userid = ($1)`,
        [userid, value],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
};

const dbRead = {
  user_profile_table_full: (userid) => {
    return new Promise((resolve, reject) => {
      query(
        "SELECT username, name, picture, followers, followings, likes, posts, views FROM user_profile_table WHERE userid = ($1)",
        [userid],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        }
      );
    });
  },
};

module.exports = {
  dbInsert,
  dbUpdate,
  dbRead,
};
