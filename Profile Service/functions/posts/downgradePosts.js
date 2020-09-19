const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

downgradePosts = (id, sqs, delParams) => {
  dbUpdate
    .decr_posts(id)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "posts");
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = downgradePosts;
