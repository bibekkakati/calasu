deleteQueueMessage = (sqs, delParams) => {
  sqs.deleteMessage(delParams, function (err, data) {
    if (err) {
      //   console.log("Delete Error", err);
    }
  });
};

module.exports = deleteQueueMessage;
