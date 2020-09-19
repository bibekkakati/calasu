const dbQuery = require("../db/query");
const { addToPersonalTimeline } = require("../redis/query");

const getTimelineByUserId = (call, callback) => {
  var { userid, offset, limit } = call.request;
  if (userid) {
    dbQuery
      .getTimelineByUserId(userid, offset, limit)
      .then((result) => {
        //organize data for redis
        var zaddArr = [];
        var postids = [];
        var timestamps = [];
        for (let i = 0; i < result.rows.length; i++) {
          zaddArr.push(result.rows[i].timestamp);
          timestamps.push(result.rows[i].timestamp);
          zaddArr.push(result.rows[i].postid);
          postids.push(result.rows[i].postid);
        }
        //add postids to timeline cache
        addToPersonalTimeline(userid, zaddArr);

        callback(null, {
          success: true,
          posts: postids,
          timestamps: timestamps,
        });
      })
      .catch((e) => {
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

module.exports = getTimelineByUserId;
