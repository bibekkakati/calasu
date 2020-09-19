const insertIntoNF = require("./insertIntoNF");
const deletePostFromNF = require("./deletePostFromNF");
const deleteUsersPostsFromNF = require("./deleteUsersPostsFromNF");
const insertIntoUsersNF_db = require("./insertIntoUsersNF_db");
const insertIntoUsersNF_cache = require("./insertIntoUsersNF_cache");
const updateNF = require("./updateNF");

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
      case "InsertPost":
        insertIntoNF(msg, sqs, delParams);
        break;

      case "DeletePost":
        deletePostFromNF(msg, sqs, delParams);
        break;

      case "RetryDB":
        insertIntoUsersNF_db(msg, sqs, delParams);
        break;

      case "RetryCache":
        insertIntoUsersNF_cache(msg, sqs, delParams);
        break;

      case "Update":
        updateNF(msg, sqs, delParams);
        break;

      case "DeletePostsFromNewsFeed":
        deleteUsersPostsFromNF(msg, sqs, delParams);
        break;

      default:
        //FIXME: error logs
        break;
    }
  }
};

module.exports = sendTo;
