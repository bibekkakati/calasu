const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { sendToPostService } = require("../queue/sendQueueMessage");
const redisQuery= require("../redis/query");

likePost = ({ postid, userid }, sqs, delParams) => {
  if (postid && userid) {
    const timestamp = Date.now();
    dbQuery.insertPostLike(postid, userid, timestamp)
      .then((res) => {
        if (res.rowCount) {
          redisQuery.addToPostLikes(postid, [timestamp, userid]);
          sendToPostService({ Type: "Like", postid });
        }
      })
      .catch((err) => {
        //FIXME: error logs
      });
  }
  deleteQueueMessage(sqs, delParams);
};

module.exports = likePost;
