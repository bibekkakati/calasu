const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { addToNewsFeedCache } = require("../redis/query");
const dbQuery = require("../db/query");
const { sendToNF_cache_PostRetry } = require("../queue/sendQueueMessage");

const insertIntoUsersNF_db = ({ userid, postid, timestamp, postedby }, sqs, delParams) => {
  dbQuery
    .insertPostIntoUsersNF(userid, postid, timestamp, postedby)
    .then((res) => {
      if (res) {
        addToNewsFeedCache(userid, [timestamp, postid])
          .then((res) => {})
          .catch((err) => {
            sendToNF_cache_PostRetry({
              userid: userid,
              postid,
              timestamp,
              postedby
            });
          });
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      //FIXME: error logs
    });
};

module.exports = insertIntoUsersNF_db;
