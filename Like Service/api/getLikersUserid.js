const dbQuery = require("../db/query");
const { addToPostLikes } = require("../redis/query");

getLikersUserid = (call, callback) => {
  const postid = call.request.postid;
  if (postid) {
    dbQuery.getLikersUserid(postid)
      .then((result) => {
        let userids = [];
        let postLikes = [];
        for (let i = 0; i < result.rows.length; i++) {
          userids.push(result.rows[i].userid);
          postLikes.push(result.rows[i].timestamp);
          postLikes.push(result.rows[i].userid);
        }
        if(postLikes.length) addToPostLikes(postid, postLikes)
        callback(null, {
          success: true,
          userids,
        });
      })
      .catch((e) => {
        //FIXME: error logs
        callback(null, {
          success: false,
        });
      });
  }
};

module.exports = getLikersUserid;
