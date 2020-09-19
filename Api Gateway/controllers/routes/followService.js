const express = require("express");
const router = express.Router();

// ALL FOLLOW SERVICE API'S
const getFollowers = require("../api/followService/getFollowers");
const getFollowings = require("../api/followService/getFollowings");
const followUser = require("../api/followService/followUser");
const unfollowUser = require("../api/followService/unfollowUser");
const getFollowState = require("../api/followService/getFollowState");

router.use("/followers", getFollowers);
router.use("/followings", getFollowings);
router.use("/follow", followUser);
router.use("/unfollow", unfollowUser);
router.use("/followstate", getFollowState);

module.exports = router;
