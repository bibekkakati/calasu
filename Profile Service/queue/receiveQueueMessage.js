// FUNCTIONS
var sendTo = require("../functions/sendTo");

//AWS SQS.
const { sqs, params_profile } = require("./sqs");

receiveFromProfileQueue = (errorCount) => {
  sqs.receiveMessage(params_profile, (err, data) => {
    if (err) {
      if (errorCount <= 10) {
        setTimeout(() => {
          receiveFromProfileQueue(errorCount + 1);
        }, 3000);
      }
      //FIXME: send to error logs
    }
    if (data.Messages) {
      sendTo(data, sqs, params_profile);
      setTimeout(() => {
        receiveFromProfileQueue(0);
      }, 3000);
    } else {
      setTimeout(() => {
        receiveFromProfileQueue(0);
      }, 3000);
    }
  });
};

startPollingQueue = () => {
  receiveFromProfileQueue(0);
};

module.exports = { startPollingQueue };
