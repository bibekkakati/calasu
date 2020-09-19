const {
  getFollowersCountFromCache,
  getFollowersFromCache,
  addToNewsFeedCache,
} = require("../redis/query");

const dbQuery = require("../db/query");

const {
  sendToNF_db_PostRetry,
  sendToNF_cache_PostRetry,
} = require("../queue/sendQueueMessage");

const deleteQueueMessage = require("../queue/deleteQueueMessage");

const { getFollowers } = require("../services/followService/client");

const insertIntoNF = ({ userid, postid, timestamp }, sqs, delParams) => {
  // get followers count of the userid
  getFollowersCountFromCache(userid)
    .then(async (followersCount) => {
      //get followers id from cache on offset/limit 20
      for (let i = 0; i < parseInt(followersCount); i = +20) {
        let followersIds = await getFollowersFromCache(userid, i, i + 20);
        insertIntoDatabase(followersIds, postid, timestamp, userid);
      }
      deleteQueueMessage(sqs, delParams);
    })
    .catch((err) => {
      //FIXME: error logs
      getFollowers(userid)
        .then((res) => {
          if (!res.followersIds) return deleteQueueMessage(sqs, delParams);
          if (res.success) {
            insertIntoDatabase(res.followersIds, postid, timestamp, userid);
            deleteQueueMessage(sqs, delParams);
          }
        })
        .catch((err) => {
          //FIXME: error logs
        });
    });
};

const insertIntoDatabase = (userids, postid, timestamp, postedby) => {
  for (let i = 0; i < userids.length; ++i) {
    dbQuery
      .insertPostIntoUsersNF(userids[i], postid, timestamp, postedby)
      .then((res) => {
        if (res) {
          addToNewsFeedCache(userids[i], [timestamp, postid])
            .then((res) => {})
            .catch((err) => {
              sendToNF_cache_PostRetry({
                userid: userids[i],
                postid,
                timestamp,
              });
            });
        }
      })
      .catch((err) => {
        //FIXME: error logs
        sendToNF_db_PostRetry({
          userid: userids[i],
          postid,
          timestamp,
          postedby,
        });
      });
  }
};

module.exports = insertIntoNF;
