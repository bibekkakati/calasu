const dbQuery = require("../db/query");
const { addToRedisFollowingsList } = require("../redis/query");

getFollowState = (call, callback) => {
  var { userid, otherUserId } = call.request;
  if (userid && otherUserId) {
    dbQuery
      .getFollowState(userid, otherUserId)
      .then((result) => {
        if (result.rowCount)
          callback(null, {
            success: true,
            following: result.rowCount ? true : false,
          });
      })
      .catch((e) => {
        console.log(e);
        callback(null, {
          success: false,
        });
      });
  } else {
    callback(null, {
      success: false,
    });
  }
};

module.exports = getFollowState;
