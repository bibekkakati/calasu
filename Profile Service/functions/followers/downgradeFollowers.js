const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

downgradeFollowers = (id, sqs, delParams) => {
  dbUpdate
    .decr_followers(id)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "followers")
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = downgradeFollowers;
