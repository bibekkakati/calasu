const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

deleteLikes = (id, value, sqs, delParams) => {
  value = parseInt(value);
  if (isNaN(value)) return;
  dbUpdate
    .decr_likes(id, value)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "likes", value);
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = deleteLikes;
