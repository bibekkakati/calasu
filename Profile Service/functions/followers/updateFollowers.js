const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { incrby } = require("../../redis/query");

updateFollowers = (id, sqs, delParams) => {
  dbUpdate
    .incr_followers(id)
    .then((res) => {
      if (res.rowCount) {
        incrby(id, "followers")
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = updateFollowers;
