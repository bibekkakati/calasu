const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { incrby } = require("../../redis/query");

updatePosts = (id, sqs, delParams) => {
  dbUpdate
    .incr_posts(id)
    .then((res) => {
      if (res.rowCount) {
        incrby(id, "posts");
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = updatePosts;
