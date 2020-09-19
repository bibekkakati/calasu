const dbQuery= require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { sendToPostService } = require("../queue/sendQueueMessage");
const redisQuery  = require("../redis/query");

unlikePost = ({ postid, userid }, sqs, delParams) => {
  if (postid && userid) {
    dbQuery.deletePostLike(postid, userid)
      .then((res) => {
        if (res.rowCount) {
          redisQuery.deletePostLike(postid, userid);
          sendToPostService({ Type: "Unlike", postid });
        }
      })
      .catch((err) => {
        //FIXME: error logs
      });
  }
  deleteQueueMessage(sqs, delParams);
};

module.exports = unlikePost;
