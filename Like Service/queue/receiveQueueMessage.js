// FUNCTIONS
var sendTo = require("../functions/sendTo");

//AWS SQS.
const { sqs, params_like } = require("./sqs");

receiveFromLikeQueue = (errorCount) => {
  sqs.receiveMessage(params_like, (err, data) => {
    if (err) {
      if (errorCount <= 10) {
        setTimeout(() => {
          receiveFromLikeQueue(errorCount + 1);
        }, 3000);
      }
      //FIXME: send to error logs
    }
    if (data.Messages) {
      sendTo(data, sqs, params_like);
      setTimeout(() => {
        receiveFromLikeQueue(0);
      }, 3000);
    } else {
      setTimeout(() => {
        receiveFromLikeQueue(0);
      }, 3000);
    }
  });
};

startPollingQueue = () => {
  receiveFromLikeQueue(0);
};

module.exports = { startPollingQueue };
