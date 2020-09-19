const { sqs } = require("./sqs");

//RETRY TO UPDATE NF WITH FOR POST FOR THE USERID
const sendToNF_db_PostRetry = (msg) => {
  msg.Type = "RetryDB";
  var queueUrl = process.env.SQS_NF_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "RetryDB",
      },
      userid: {
        DataType: "String",
        StringValue: msg.userid,
      },
      postid: {
        DataType: "String",
        StringValue: msg.postid,
      },
      postedby: {
          DataType: "String",
        StringValue: msg.postedby,
      },
      timestamp: {
        DataType: "String",
        StringValue: msg.timestamp,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      //FIXME: send to error logs
    }
  });
};

const sendToNF_cache_PostRetry = (msg) => {
  msg.Type = "RetryCache";
  var queueUrl = process.env.SQS_NF_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "RetryCache",
      },
      userid: {
        DataType: "String",
        StringValue: msg.userid,
      },
      postid: {
        DataType: "String",
        StringValue: msg.postid,
      },
      timestamp: {
        DataType: "String",
        StringValue: msg.timestamp,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      //FIXME: send to error logs
    }
  });
};

module.exports = { sendToNF_db_PostRetry, sendToNF_cache_PostRetry };
