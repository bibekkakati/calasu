const { sqs } = require("./sqs");

//SEND TO NEWS FEED THROUGH QUEUE FOR POST DELETION FROM THE GIVEN USERID
const sendToNF_PostDel = (msg) => {
  return new Promise((resolve, reject) => {
    msg.Type = "DeletePost";
    var queueUrl = process.env.SQS_NF_SERVICE_URL;
    var params = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: queueUrl,
      MessageAttributes: {
        Type: {
          DataType: "String",
          StringValue: "DeletePost",
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
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const sendToNF_PostInsert = (msg) => {
  return new Promise((resolve, reject) => {
    msg.Type = "InsertPost";
    var queueUrl = process.env.SQS_NF_SERVICE_URL;
    var params = {
      MessageBody: JSON.stringify(msg),
      QueueUrl: queueUrl,
      MessageAttributes: {
        Type: {
          DataType: "String",
          StringValue: "InsertPost",
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
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const sendToProfileService = (msg) => {
  var queueUrl = process.env.SQS_PROFILE_URL;
  var params = {
    MessageBody: JSON.stringify(msg),
    QueueUrl: queueUrl,
    MessageAttributes: {
      Type: {
        DataType: "String",
        StringValue: msg.Type,
      },
      act: {
        DataType: "String",
        StringValue: msg.act,
      },
      id: {
        DataType: "String",
        StringValue: msg.id,
      },
      value: {
        DataType: "Number",
        StringValue: msg.value,
      },
    },
  };

  sqs.sendMessage(params, (err, data) => {
    if (err) {
      //FIXME: send to error logs
    }
  });
};

const sendToLikeService = (msg) => {
  var queueUrl = process.env.SQS_LIKE_SERVICE_URL;
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

module.exports = {
  sendToNF_PostDel,
  sendToNF_PostInsert,
  sendToProfileService,
  sendToLikeService,
};
