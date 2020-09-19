const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const {
  sendToTotalFollowersQueue,
  sendToTotalFollowingsQueue,
  sendToNFQueueForUpdate,
} = require("../queue/sendQueueMessage");

const {
  addToRedisFollowingsList,
  addToRedisFollowersList,
} = require("../redis/query");

followUser = (msg, sqs, delParams) => {
  var { user1, user2 } = msg;
  if (user1 !== user2) {
    var timestamp = Date.now();
    dbQuery
      .followUser(user1, user2, timestamp)
      .then((result) => {
        if (result.rowCount) {
          addToRedisFollowingsList(user2, [timestamp, user1]);
          addToRedisFollowersList(user1, [timestamp, user2]);

          //increment total followings for id
          sendToTotalFollowingsQueue({ id: user2, act: "follow" });

          //increment total followers for  otheruserid
          sendToTotalFollowersQueue({ id: user1, act: "follow" });

          //update the users newsfeed
          sendToNFQueueForUpdate({ updateForUser: user2, takeFromUser: user1 });
        }

        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      })
      .catch((e) => {
        deleteQueueMessage(sqs, delParams);
        //FIXME: send error logs
      });
  } else {
    deleteQueueMessage(sqs, delParams);
  }
};

module.exports = followUser;
