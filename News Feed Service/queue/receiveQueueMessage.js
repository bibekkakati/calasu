// FUNCTIONS
var sendTo = require("../functions/sendTo");

//AWS SQS.
const { sqs, params_nf } = require("./sqs");

const receiveFromNewsFeedQueue = (errorCount) => {
  sqs.receiveMessage(params_nf, (err, data) => {
    if (err) {
      if (errorCount <= 10) {
        setTimeout(() => {
          receiveFromNewsFeedQueue(errorCount + 1);
        }, 3000);
      }
      //FIXME: send to error logs
    }
    if (data.Messages) {
      sendTo(data, sqs, params_nf);
      setTimeout(() => {
        receiveFromNewsFeedQueue(0);
      }, 3000);
    } else {
      setTimeout(() => {
        receiveFromNewsFeedQueue(0);
      }, 3000);
    }
  });
};

const startPollingQueue = () => {
  receiveFromNewsFeedQueue(0);
};

module.exports = { startPollingQueue };
