const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const {
  sendToTotalFollowersQueue,
  sendToTotalFollowingsQueue,
  sendToNFQueueForDelete,
} = require("../queue/sendQueueMessage");

const {
  delFromRedisFollowingsList,
  delFromRedisFollowersList,
} = require("../redis/query");

unfollowUser = (msg, sqs, delParams) => {
  var { user1, user2 } = msg;
  if (user1 !== user2) {
    dbQuery
      .unfollowUser(user1, user2)
      .then((result) => {
        if (result.rowCount) {
          delFromRedisFollowingsList(user2, user1);
          delFromRedisFollowersList(user1, user2);

          //increment total followings for id
          sendToTotalFollowingsQueue({ id: user2, act: "unfollow" });

          //increment total followers for  otheruserid
          sendToTotalFollowersQueue({ id: user1, act: "unfollow" });

          //delete posts from deleteForUser userid from mewsfeed
          sendToNFQueueForDelete({ deleteForUser: user2, whosePosts: user1 });
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

module.exports = unfollowUser;
