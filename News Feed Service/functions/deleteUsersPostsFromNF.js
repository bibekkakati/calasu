const dbQuery = require("../db/query");
const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { deleteFromNewsFeedCache } = require("../redis/query");
const { getPostsByUserid } = require("../services/postService/client");

const deleteUsersPostsFromNF = (
  { deleteForUser, whosePosts },
  sqs,
  delParams
) => {
  if (deleteForUser && whosePosts) {
    getPostsByUserid(whosePosts, 0, 10000)
      .then((res) => {
        if (!res.posts) return deleteQueueMessage(sqs, delParams);
        if (res.success) {
          var postids = [];
          var timestamps = [];
          for (let i = 0; i < res.posts.length; i++) {
            postids.push(res.posts[i]);
            timestamps.push(res.timestamps[i]);
          }
          dbQuery
            .deleteMultiplePostsFromNF(deleteForUser, postids, timestamps)
            .then((res) => {
              if (res) {
                deleteFromNewsFeedCache(deleteForUser, postids);
                deleteQueueMessage(sqs, delParams);
              }
            })
            .catch((err) => {
              console.log(err);
              //FIXME: error logs
            });
        }
      })
      .catch((e) => {
        //FIXME: error logs
      });
  }
};

module.exports = deleteUsersPostsFromNF;
