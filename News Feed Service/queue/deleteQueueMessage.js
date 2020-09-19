const deleteQueueMessage = (sqs, delParams) => {
  sqs.deleteMessage(delParams, function (err, data) {
    if (err) {
      //FIXME: error logs
      //   console.log("Delete Error", err);
    }
  });
};

module.exports = deleteQueueMessage;
