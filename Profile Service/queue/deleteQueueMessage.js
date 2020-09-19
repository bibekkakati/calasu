deleteQueueMessage = (sqs, delParams) => {
  sqs.deleteMessage(delParams, function (err, data) {
    if (err) {
      //   console.log("Delete Error", err);
      //FIXME: send error logs
    }
  });
};

module.exports = deleteQueueMessage;
