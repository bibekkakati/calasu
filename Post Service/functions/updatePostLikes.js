const deleteQueueMessage = require("../queue/deleteQueueMessage");
const dbQuery = require("./../db/query");
const { incrby, decrby } = require("../redis/query");

const updatePostLikes = ({ postid }, sqs, delParams, increment) => {
  if (postid) {
    if (increment) {
      dbQuery
        .incrementPostLikes(postid)
        .then((res) => {
          if (res.rowCount) {
            incrby(postid, "likes");
            deleteQueueMessage(sqs, delParams);
          }
        })
        .catch((e) => {
          //FIXME: error logs
        });
    } else {
      dbQuery
        .decrementPostLikes(postid)
        .then((res) => {
          if (res.rowCount) {
            decrby(postid, "likes");
            deleteQueueMessage(sqs, delParams);
          }
        })
        .catch((e) => {
          //FIXME: error logs
        });
    }
  } else {
    deleteQueueMessage(sqs, delParams);
  }
};

module.exports = updatePostLikes;
