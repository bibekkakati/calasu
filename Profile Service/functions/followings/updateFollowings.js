const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { incrby } = require("../../redis/query");

updateFollowings = (id, sqs, delParams) => {
  dbUpdate
    .incr_followings(id)
    .then((res) => {
      if (res.rowCount) {
        incrby(id, 'followings');
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = updateFollowings;
