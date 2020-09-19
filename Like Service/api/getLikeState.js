const dbQuery = require("../db/query");

getLikeState = (call, callback) => {
  const postid = call.request.postid;
  const userid = call.request.userid;
  if (postid && userid) {
    dbQuery
      .getLikeState(userid, postid)
      .then((result) => {
        if (result.rowCount) {
          callback(null, {
            success: true,
            liked: true,
          });
        } else {
          callback(null, {
            success: true,
            liked: false,
          });
        }
      })
      .catch((e) => {
        //FIXME: error logs
        callback(null, {
          success: false,
        });
      });
  }
};

module.exports = getLikeState;
