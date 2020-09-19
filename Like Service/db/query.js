const { query } = require("./db");
const likesTable = "post_likes_table";

insertPostLike = (postid, userid, timestamp) => {
  return new Promise((resolve, reject) => {
    const q = `INSERT INTO ${likesTable}(postid, userid, timestamp) VALUES($1, $2, $3)`;
    const params = [postid, userid, timestamp];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

deletePostLike = (postid, userid) => {
  return new Promise((resolve, reject) => {
    const q = `DELETE FROM ${likesTable} WHERE postid = ($1) AND userid = ($2)`;
    const params = [postid, userid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

deletePostLikes = (postid) => {
  return new Promise((resolve, reject) => {
    const q = `DELETE FROM ${likesTable} WHERE postid = ($1)`;
    const params = [postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

getLikersUserid = (postid) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT userid, timestamp FROM ${likesTable} WHERE postid = ($1)`;
    const params = [postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

getLikesCount = (postid) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT COUNT(*) AS likes FROM ${likesTable} WHERE postid = ($1)`;
    const params = [postid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

getLikeState = (userid, postid) => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM ${likesTable} WHERE postid = ($1) AND userid = ($2)`;
    const params = [postid, userid];
    query(q, params, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

module.exports = {
  insertPostLike,
  deletePostLike,
  deletePostLikes,
  getLikersUserid,
  getLikesCount,
  getLikeState,
};
