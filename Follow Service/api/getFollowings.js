const dbQuery = require("../db/query");
const { addToRedisFollowingsList } = require("./../redis/query");

getFollowings = (call, callback) => {
  var { userid } = call.request;
  if (userid) {
    dbQuery
      .getFollowings(userid)
      .then((result) => {
        if (result.rowCount) {
          var zaddArr = [];
          var userIdList = []
          for (let i = 0; i < result.rows.length; i++) {
            zaddArr.push(result.rows[i].timestamp);
            zaddArr.push(result.rows[i].followeeid);
            userIdList.push(result.rows[i].followeeid);
          }
          addToRedisFollowingsList(userid, zaddArr);
        }
        callback(null, {
          success: true,
          userIdList: userIdList,
        });
      })
      .catch((e) => {
        callback(null, {
          success: false,
          userIdList: [],
        });
      });
  } else {
    callback(null, {
      success: false,
      userIdList: [],
    });
  }
};

module.exports = getFollowings;
