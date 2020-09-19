const { sqs } = require("./sqs");

sendToCreateProfileQueue = (msg) => {
  msg.Type = "createProfile";
  var queueUrl = process.env.SQS_CREATE_PROFILE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "createProfile",
      },
      id: {
        DataType: "String",
        StringValue: msg.id,
      },
      email: {
        DataType: "String",
        StringValue: msg.email,
      },
      username: {
        DataType: "String",
        StringValue: msg.username,
      },
      name: {
        DataType: "String",
        StringValue: msg.name,
      },
      picture: {
        DataType: "String",
        StringValue: msg.picture,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      sendToCreateProfileQueue(msg, queueUrl);
      //FIXME: send to error logs
    }
  });
};

module.exports = { sendToCreateProfileQueue };
