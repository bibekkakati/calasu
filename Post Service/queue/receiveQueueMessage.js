// FUNCTIONS
var sendTo = require("../functions/sendTo");

//AWS SQS.
const { sqs, params_post } = require("./sqs");

const receiveFromPostQueue = (errorCount) => {
  sqs.receiveMessage(params_post, (err, data) => {
    if (err) {
      if (errorCount <= 10) {
        setTimeout(() => {
          receiveFromPostQueue(errorCount + 1);
        }, 3000);
      }
      //FIXME: send to error logs
    }
    if (data.Messages) {
      sendTo(data, sqs, params_post);
      setTimeout(() => {
        receiveFromPostQueue(0);
      }, 3000);
    } else {
      setTimeout(() => {
        receiveFromPostQueue(0);
      }, 3000);
    }
  });
};

const startPollingQueue = () => {
  receiveFromPostQueue(0);
};

module.exports = { startPollingQueue };
