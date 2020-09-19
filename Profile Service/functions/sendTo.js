const Type = require("./actions.json");

const createProfile = require("./profile/createProfile");

const updateFollowers = require("./followers/updateFollowers");
const downgradeFollowers = require("./followers/downgradeFollowers");

const updateFollowings = require("./followings/updateFollowings");
const downgradeFollowings = require("./followings/downgradeFollowings");

const updateLikes = require("./likes/updateLikes");
const downgradeLikes = require("./likes/downgradeLikes");
const deleteLikes = require("./likes/deleteLikes");

const updateViews = require("./views/updateViews");
const deleteViews = require("./views/deleteViews");

const updatePosts = require("./posts/updatePosts");
const downgradePosts = require("./posts/downgradePosts");

sendTo = (data, sqs, queue) => {
  queue = queue.QueueUrl;
  var messages = data.Messages;
  for (let i = 0; i < messages.length; i++) {
    var msg = messages[i].Body;
    msg = JSON.parse(msg);
    var id = msg.id;
    var delParams = {
      QueueUrl: queue,
      ReceiptHandle: messages[i].ReceiptHandle,
    };
    switch (msg.Type) {
      case Type.createProfile:
        createProfile(msg, sqs, delParams);
        break;

      case Type.followers:
        if (msg.act === "follow") {
          updateFollowers(id, sqs, delParams);
        } else if (msg.act === "unfollow") {
          downgradeFollowers(id, sqs, delParams);
        }
        break;

      case Type.followings:
        if (msg.act === "follow") {
          updateFollowings(id, sqs, delParams);
        } else if (msg.act === "unfollow") {
          downgradeFollowings(id, sqs, delParams);
        }
        break;

      case Type.likes:
        if (msg.act === "like") {
          updateLikes(id, sqs, delParams);
        } else if (msg.act === "dislike") {
          downgradeLikes(id, sqs, delParams);
        } else if (msg.act === "deleteLikes") {
          deleteLikes(id, msg.value, sqs, delParams);
        }
        break;

      case Type.posts:
        if (msg.act === "posted") {
          updatePosts(id, sqs, delParams);
        } else if (msg.act === "deleted") {
          downgradePosts(id, sqs, delParams);
        }
        break;

      case Type.views:
        if (msg.act === "viewed") {
          updateViews(id, sqs, delParams);
        } else if (msg.act === "deleteViews") {
          deleteViews(id, msg.value, sqs, delParams);
        }
        break;

      default:
        continue;
    }
  }
};

module.exports = sendTo;
