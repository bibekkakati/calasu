const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

downgradeLikes = (id, sqs, delParams) => {
  dbUpdate
    .decr_likes(id)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "likes");
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = downgradeLikes;
