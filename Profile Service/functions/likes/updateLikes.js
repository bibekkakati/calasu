const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { incrby } = require("../../redis/query");

updateLikes = (id, sqs, delParams) => {
  dbUpdate
    .incr_likes(id)
    .then((res) => {
      if (res.rowCount) {
        incrby(id, "likes")
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = updateLikes;
