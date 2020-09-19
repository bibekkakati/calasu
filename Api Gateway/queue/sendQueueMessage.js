const { sqs } = require("./sqs");

sendToFollowUserQueue = (res, msg) => {
  msg.action = "follow";
  var queueUrl = process.env.SQS_FOLLOW_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      action: {
        DataType: "String",
        StringValue: "follow",
      },
      user2: {
        DataType: "String",
        StringValue: msg.user2,
      },
      user1: {
        DataType: "String",
        StringValue: msg.user1,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      res.send({ success: false });
      //FIXME: send to error logs
    } else {
      res.send({ success: true });
    }
  });
};

sendToUnfollowUserQueue = (res, msg) => {
  msg.action = "unfollow";
  var queueUrl = process.env.SQS_FOLLOW_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      action: {
        DataType: "String",
        StringValue: "unfollow",
      },
      user2: {
        DataType: "String",
        StringValue: msg.user2,
      },
      user1: {
        DataType: "String",
        StringValue: msg.user1,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      res.send({ success: false });
      //FIXME: send to error logs
    } else {
      res.send({ success: true });
    }
  });
};

sendToLikePostQueue = (res, msg) => {
  msg.Type = "Like";
  var queueUrl = process.env.SQS_LIKE_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "Like",
      },
      postid: {
        DataType: "String",
        StringValue: msg.postid,
      },
      userid: {
        DataType: "String",
        StringValue: msg.userid,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      res.send({ success: false });
      //FIXME: send to error logs
    } else {
      res.send({ success: true });
    }
  });
};

sendToUnlikePostQueue = (res, msg) => {
  msg.Type = "Unlike";
  var queueUrl = process.env.SQS_LIKE_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "Unlike",
      },
      postid: {
        DataType: "String",
        StringValue: msg.postid,
      },
      userid: {
        DataType: "String",
        StringValue: msg.userid,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      res.send({ success: false });
      //FIXME: send to error logs
    } else {
      res.send({ success: true });
    }
  });
};

module.exports = {
  sendToFollowUserQueue,
  sendToUnfollowUserQueue,
  sendToLikePostQueue,
  sendToUnlikePostQueue,
};
