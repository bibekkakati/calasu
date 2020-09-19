const deleteQueueMessage = require("../queue/deleteQueueMessage");
const dbQuery = require("./../db/query");
const { incrby } = require("../redis/query");

const updatePostViews = ({ postid }, sqs, delParams) => {
  if (postid) {
    dbQuery
      .incrementPostViews(postid)
      .then((res) => {
        if (res.rowCount) {
          incrby(postid, "views");
          deleteQueueMessage(sqs, delParams);
        }
      })
      .catch((e) => {
        //FIXME: error logs
      });
  } else {
    deleteQueueMessage(sqs, delParams);
  }
};

module.exports = updatePostViews;
