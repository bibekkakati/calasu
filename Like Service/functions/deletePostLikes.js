const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const redisQuery = require("../redis/query");

deletePostLikes = ({ postid }, sqs, delParams) => {
  if (postid) {
    dbQuery.deletePostLikes(postid)
      .then((res) => {
        if (res.rowCount) {
          redisQuery.deletePostLikes(postid);
          deleteQueueMessage(sqs, delParams);
        }
      })
      .catch((err) => {
        //FIXME: error logs
      });
  } else {
    deleteQueueMessage(sqs, delParams);
  }
};

module.exports = deletePostLikes;
