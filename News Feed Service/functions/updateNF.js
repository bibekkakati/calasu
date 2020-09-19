const { getPostsOfUser, addToNewsFeedCache } = require("../redis/query");

const dbQuery = require("../db/query");

const {
  sendToNF_db_PostRetry,
  sendToNF_cache_PostRetry,
} = require("../queue/sendQueueMessage");

const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { getPostsByUserid } = require("../services/postService/client");

const updateNF = ({ updateForUser, takeFromUser }, sqs, delParams) => {
  //get the posts of the user(take from user)
  getPostsOfUser(takeFromUser, 0, 20)
    .then((postidsWithTimestamp) => {
      insertIntoDatabase(updateForUser, postidsWithTimestamp, takeFromUser);
      deleteQueueMessage(sqs, delParams);
    })
    .catch((err) => {
      //call post service for posts

      getPostsByUserid(takeFromUser, 0, 20)
        .then((res) => {
          if (!res.posts) return deleteQueueMessage(sqs, delParams);
          if (res.success) {
            var postidsWithTimestamp = [];
            for (let i = 0; i < res.posts.length; i++) {
              postidsWithTimestamp.push(res.posts[i]);
              postidsWithTimestamp.push(res.timestamps[i]);
            }
            insertIntoDatabase(
              updateForUser,
              postidsWithTimestamp,
              takeFromUser
            );
            deleteQueueMessage(sqs, delParams);
          }
        })
        .catch((e) => {
          //FIXME: error logs
        });
    });
};

const insertIntoDatabase = (userid, values, postedby) => {
  dbQuery
    .updateUsersNF_multiplePosts(userid, values, postedby)
    .then((res) => {
      //[postid, timestamp, ...] is the format of values
      values = values.reverse();
      addToNewsFeedCache(userid, values)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
          for (let i = 0; i < values.length; i = i + 2) {
            sendToNF_cache_PostRetry({
              userid: userid,
              postid: values[i + 1],
              timestamp: values[i],
            });
          }
        });
    })
    .catch((err) => {
      console.log(err);
      //FIXME: error logs
      for (let i = 0; i < values.length; i = i + 2)
        sendToNF_db_PostRetry({
          userid: userid,
          postid: values[i + 1],
          timestamp: values[i],
          postedby: postedby,
        });
    });
};

module.exports = updateNF;
