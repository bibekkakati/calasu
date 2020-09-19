const { dbUpdate } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");
const { decrby } = require("../../redis/query");

deleteViews = (id, value, sqs, delParams) => {
  value = parseInt(value);
  if (isNaN(value)) return;
  dbUpdate
    .delete_views(id, value)
    .then((res) => {
      if (res.rowCount) {
        decrby(id, "views", value);
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: SEND ERROR LOG TO ERROR SERVICE
    });
};

module.exports = deleteViews;
