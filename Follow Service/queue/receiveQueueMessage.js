// FUNCTIONS
var sendTo = require("../functions/sendTo");

//AWS SQS.
const { sqs, params_follow_user} = require("./sqs");

receiveFromFollowUser = (errorCount) => {
  sqs.receiveMessage(params_follow_user, (err, data) => {
    if (err) {
      if (errorCount <= 10) {
        setTimeout(() => {
        receiveFromFollowUser(errorCount + 1);
      }, 3000);
      }
      //FIXME: send to error logs
    }
    if (data.Messages) {
      sendTo(data, sqs, params_follow_user);
      setTimeout(() => {
        receiveFromFollowUser(0);
      }, 3000);
    } else {
      setTimeout(() => {
        receiveFromFollowUser(0);
      }, 3000);
    }
  });
};

startPollingQueue = () => {
  receiveFromFollowUser(0);
};

module.exports = { startPollingQueue };
