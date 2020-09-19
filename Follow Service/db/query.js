var { query, getPool } = require("./db");
var followers_table = "followers_table";
var followings_table = "followings_table";

//FOLLOWERS TABLE: By whom I am being followed i.e, userid's followers
//FOLLOWINGS TABLE: whom I am following

followUser = async (user1, user2, timestamp) =>
  new Promise(async (resolve, reject) => {
    var pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      var queryText = `INSERT INTO ${followers_table}(userid, followerid, timestamp) VALUES($1, $2, $3)`;
      var res = await client.query(queryText, [user1, user2, timestamp]);
      queryText = `INSERT INTO ${followings_table}(userid, followeeid, timestamp) VALUES($1, $2, $3)`;
      res = await client.query(queryText, [user2, user1, timestamp]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      reject(e);
      //FIXME: error logs
    } finally {
      client.release();
      resolve(res);
    }
  });

unfollowUser = async (user1, user2) =>
  new Promise(async (resolve, reject) => {
    var pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      var queryText = `DELETE FROM ${followers_table} WHERE userid = ($1) AND followerid = ($2)`;
      var res = await client.query(queryText, [user1, user2]);
      queryText = `DELETE FROM ${followings_table} WHERE userid = ($1) AND followeeid = ($2)`;
      res = await client.query(queryText, [user2, user1]);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      reject(e);
      //FIXME: error logs
    } finally {
      client.release();
      resolve(res);
    }
  });

getFollowers = (userid) =>
  new Promise((resolve, reject) => {
    var q = `SELECT followerid, timestamp FROM ${followers_table} WHERE userid = ($1)`;
    var params = [userid];
    query(q, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

getFollowings = (userid) =>
  new Promise((resolve, reject) => {
    var q = `SELECT followeeid, timestamp FROM ${followings_table} WHERE userid = ($1)`;

    var params = [userid];
    query(q, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

getFollowState = (user1, user2) =>
  new Promise((resolve, reject) => {
    var q = `SELECT timestamp FROM ${followings_table} WHERE userid = ($1) AND followeeid = ($2)`;

    var params = [user1, user2];
    query(q, params, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
  getFollowState,
};
