const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

downgradeFollowings = (id, sqs, delParams) => {
  dbUpdate
    .decr_followings(id)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "followings")
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = downgradeFollowings;
