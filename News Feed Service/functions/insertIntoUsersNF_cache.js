const { addToNewsFeedCache } = require("../redis/query");

const insertIntoUsersNF_cache = ({ userid, postid, timestamp}, sqs, delParams) => {
  addToNewsFeedCache(userid, [timestamp, postid])
    .then((res) => {
      deleteQueueMessage(sqs, delParams);
    })
    .catch((err) => {
      //FIXME: error logs
    });
};

module.exports = insertIntoUsersNF_cache;
