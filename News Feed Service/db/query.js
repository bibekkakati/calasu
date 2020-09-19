const client = require("./db").getClient();

const deleteMultiplePostsFromNF = (userid, postids, timestamps) => {
  return new Promise((resolve, reject) => {
    const query =
      "DELETE FROM news_feed.nf WHERE userid = ? AND timestamp = ? AND postid = ? IF EXISTS";
    var queries = [];

    for (let i = 0; i < postids.length; i = i + 2) {
      queries.push({
        query: query,
        params: [userid, parseInt(timestamps[i]), postids[i]],
      });
    }
    client
      .batch(queries, { prepare: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        //FIXME: error logs
        reject(err);
      });
  });
};

const deleteFromNF = (userids, postid, timestamp) => {
  return new Promise((resolve, reject) => {
    const query =
      "DELETE FROM news_feed.nf WHERE userid = ? AND timestamp = ? AND postid = ? IF EXISTS";
    var queries = [];

    for (let i = 0; i < userids.length; i = i + 2) {
      queries.push({
        query: query,
        params: [userids[i], timestamp, postid],
      });
    }
    client
      .batch(queries, { prepare: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        //FIXME: error logs
        reject(err);
      });
  });
};

const insertPostIntoUsersNF = (userid, postid, timestamp, postedby) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO news_feed.nf(userid, timestamp, postid,  postedby) VALUES(?, ?, ?, ?)";
    client
      .execute(query, [userid, parseInt(timestamp), postid, postedby], {
        prepare: true,
      })
      .then((result) => {
        resolve(result.rowLength);
      })
      .catch((err) => {
        //FIXME: error logs
        reject(err);
      });
  });
};

const updateUsersNF_multiplePosts = (userid, values, postedby) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO news_feed.nf(userid, timestamp, postid, postedby) VALUES(?, ?, ?, ?)";
    var queries = [];
    //[postid1, timestamp1, postid2, timestamp2] is the format of values
    for (let i = 0; i < values.length; i = i + 2) {
      queries.push({
        query: query,
        params: [userid, parseInt(values[i + 1]), values[i], postedby],
      });
    }
    client
      .batch(queries, { prepare: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        //FIXME: error logs
        reject(err);
      });
  });
};

const getNewsFeed = (userid, timestamp) => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT timestamp, postid FROM news_feed.nf WHERE userid = ? AND timestamp > ? LIMIT 10";
    client
      .execute(query, [userid, parseInt(timestamp)], { prepare: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        //FIXME: error logs
        reject(err);
      });
  });
};

module.exports = {
  deleteFromNF,
  insertPostIntoUsersNF,
  getNewsFeed,
  updateUsersNF_multiplePosts,
  deleteMultiplePostsFromNF,
};
