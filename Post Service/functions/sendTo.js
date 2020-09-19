const updatePostViews = require("./updatePostViews");
const updatePostLikes = require("./updatePostLikes");
const updateTimeline = require("./updateTimeline");

const sendTo = (data, sqs, queue) => {
  queue = queue.QueueUrl;
  var messages = data.Messages;
  for (let i = 0; i < messages.length; i++) {
    var msg = messages[i].Body;
    msg = JSON.parse(msg);
    var delParams = {
      QueueUrl: queue,
      ReceiptHandle: messages[i].ReceiptHandle,
    };
    switch (msg.Type) {
      case "View":
        updatePostViews(msg, sqs, delParams);
        break;

      case "Like":
        updatePostLikes(msg, sqs, delParams, true);
        break;

      case "Unlike":
        updatePostLikes(msg, sqs, delParams, false);
        break;

      //S3 EVENTS
      case "Notification":
        updateTimeline(msg.Message, sqs, delParams);
        break;

      default:
        //FIXME: error logs
        break;
    }
  }
};

module.exports = sendTo;
