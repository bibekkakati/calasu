const dbQuery = require("./../db/query");
const {
  deleteFromPostMetaDataCache,
  delFromPersonalTimeline,
} = require("../redis/query");
const {
  sendToProfileService,
  sendToLikeService,
  sendToNF_PostDel,
} = require("../queue/sendQueueMessage");

const deletePost = (call, callback) => {
  var { userid, postid } = call.request;
  if (postid && userid) {
    dbQuery
      .deletePost(userid, postid)
      .then((res) => {
        if (res.rowCount) {
          deleteFromPostMetaDataCache(postid);
          delFromPersonalTimeline(userid, postid);
          sendToLikeService({ Type: "PostDeleted", postid });
          sendToNF_PostDel({
            userid,
            postid,
            timestamp: res.rows[0].timestamp,
          });
          sendToProfileService({
            Type: "posts",
            act: "deleted",
            id: userid,
            value: 1,
          });
          sendToProfileService({
            Type: "likes",
            act: "deleteLikes",
            id: userid,
            value: res.rows[0].likes,
          });
          sendToProfileService({
            Type: "views",
            act: "deleteViews",
            id: userid,
            value: res.rows[0].views,
          });
          callback(null, {
            success: true,
          });
        } else {
          callback(null, {
            success: false,
          });
        }
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

module.exports = deletePost;
