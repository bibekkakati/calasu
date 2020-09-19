const dbQuery = require("../db/query");

getLikesCount = (call, callback) => {
  const postid = call.request.postid;
  if (postid) {
    dbQuery
      .getLikesCount(postid)
      .then((result) => {
        if (result.rowCount) {
          callback(null, {
            success: true,
            likes: result.rows[0].likes,
          });
        } else {
          callback(null, {
            success: true,
            likes: 0,
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

module.exports = getLikesCount;
