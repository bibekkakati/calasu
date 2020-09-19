const followUser = require("./followUser");
const unfollowUser = require("./unfollowUser");

sendTo = (data, sqs, queue) => {
  queue = queue.QueueUrl;
  var messages = data.Messages;
  for (let i = 0; i < messages.length; i++) {
    var msg = messages[i].Body;
    msg = JSON.parse(msg);
    var delParams = {
      QueueUrl: queue,
      ReceiptHandle: messages[i].ReceiptHandle,
    };
    switch (msg.action) {
      case "follow":
        followUser(msg, sqs, delParams);
        break;

      case "unfollow":
        unfollowUser(msg, sqs, delParams);
        break;

      default:
        continue;
    }
  }
};

module.exports = sendTo;
