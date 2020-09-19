const dbQuery = require("../db/query");

const getNewsFeed = (call, callback) => {
  const { userid, timestamp } = call.request;
  if (userid && timestamp) {
    dbQuery
      .getNewsFeed(userid, timestamp)
      .then((res) => {
        let postids = [];
        for (let i = 0; i < res.rows.length; ++i) {
          postids.push(res.rows[i].postid);
        }

        callback(null, {
          success: true,
          postids: postids,
        });
      })
      .catch((err) => {
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

module.exports = getNewsFeed;
