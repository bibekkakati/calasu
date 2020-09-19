const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const {
  deleteFromNewsFeedCache,
  getFollowersCountFromCache,
  getFollowersFromCache,
} = require("../redis/query");
const { getFollowers } = require("../services/followService/client");

const deletePostFromNF = ({ userid, postid, timestamp }, sqs, delParams) => {
  if (userid && postid && timestamp) {
    // get followers count of the userid
    getFollowersCountFromCache(userid)
      .then(async (followersCount) => {
        let followersIds = await getFollowersFromCache(
          userid,
          0,
          followersCount
        );
        dbQuery
          .deleteFromNF(followersIds, postid, timestamp)
          .then((res) => {
            for (let i = 0; i < followersIds.length; i++) {
              deleteFromNewsFeedCache(followersIds[i], postid);
            }
            deleteQueueMessage(sqs, delParams);
          })
          .catch((err) => {
            //FIXME: error logs
          });
        deleteQueueMessage(sqs, delParams);
      })
      .catch((err) => {
        //FIXME: error logs
        getFollowers(userid)
          .then((res) => {
            if (!res.followersIds) return deleteQueueMessage(sqs, delParams);
            if (res.success) {
              dbQuery
                .deleteFromNF(followersIds, postid, timestamp)
                .then((res) => {
                  for (let i = 0; i < followersIds.length; i++) {
                    deleteFromNewsFeedCache(followersIds[i], postid);
                  }
                  deleteQueueMessage(sqs, delParams);
                })
                .catch((err) => {
                  //FIXME: error logs
                });
            }
          })
          .catch((err) => {
            //FIXME: error logs
          });
      });

    dbQuery
      .deleteFromNF(userid, postid)
      .then((res) => {
        if (res) {
          deleteFromNewsFeedCache(userid, postid);
          deleteQueueMessage(sqs, delParams);
        }
      })
      .catch((err) => {
        //FIXME: error logs
      });
  }
};

module.exports = deletePostFromNF;
