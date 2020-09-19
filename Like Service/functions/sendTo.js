const likePost = require("./likePost");
const unlikePost = require("./unlikePost");
const deletePostLikes = require("./deletePostLikes");

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
    switch (msg.Type) {
      case "Like":
        likePost(msg, sqs, delParams);
        break;

      case "Unlike":
        unlikePost(msg, sqs, delParams);
        break;

      case "PostDeleted":
        deletePostLikes(msg, sqs, delParams);
        break;

      default:
        //FIXME: error logs
        break;
    }
  }
};

module.exports = sendTo;
