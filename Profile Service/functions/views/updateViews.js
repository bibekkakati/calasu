const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { incrby } = require("../../redis/query");

updateViews = (id, sqs, delParams) => {
  dbUpdate
    .incr_views(id)
    .then((res) => {
      if (res.rowCount) {
        incrby(id, "views");
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = updateViews;
