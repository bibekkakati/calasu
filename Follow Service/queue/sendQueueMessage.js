const { sqs } = require("./sqs");

const sendToTotalFollowingsQueue = (msg) => {
  msg.Type = "followings";
  var queueUrl = process.env.SQS_PROFILE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "followings",
      },
      id: {
        DataType: "String",
        StringValue: msg.id,
      },
      act: {
        DataType: "String",
        StringValue: msg.act,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      sendToTotalFollowingsQueue(msg);
      //FIXME: send to error logs
    }
  });
};

const sendToTotalFollowersQueue = (msg) => {
  msg.Type = "followers";
  var queueUrl = process.env.SQS_PROFILE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "followers",
      },
      id: {
        DataType: "String",
        StringValue: msg.id,
      },
      act: {
        DataType: "String",
        StringValue: msg.act,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      sendToTotalFollowersQueue(msg);
      //FIXME: send to error logs
    }
  });
};

const sendToNFQueueForUpdate = (msg) => {
  msg.Type = "Update";
  var queueUrl = process.env.SQS_NF_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "Update",
      },
      updateForUser: {
        DataType: "String",
        StringValue: msg.updateForUser,
      },
      takeFromUser: {
        DataType: "String",
        StringValue: msg.takeFromUser,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      sendToTotalFollowersQueue(msg);
      //FIXME: send to error logs
    }
  });
};

const sendToNFQueueForDelete = (msg) => {
  msg.Type = "DeletePostsFromNewsFeed";
  var queueUrl = process.env.SQS_NF_SERVICE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: "DeletePostsFromNewsFeed",
      },
      deleteForUser: {
        DataType: "String",
        StringValue: msg.deleteForUser,
      },
      whosePosts: {
        DataType: "String",
        StringValue: msg.whosePosts,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      sendToTotalFollowersQueue(msg);
      //FIXME: send to error logs
    }
  });
};

module.exports = {
  sendToTotalFollowersQueue,
  sendToTotalFollowingsQueue,
  sendToNFQueueForUpdate,
  sendToNFQueueForDelete,
};
