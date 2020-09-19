sendToPostService = (msg) => {
  var queueUrl = process.env.SQS_POST_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: msg.Type,
      },
      postid: {
        DataType: "String",
        StringValue: msg.postid,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      //FIXME: send to error logs
    }
  });
};

module.exports = { sendToPostService };
