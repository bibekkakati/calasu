const express = require("express");
const router = express.Router();

// ALL LIKE SERVICE API'S
const getLikersUserid = require("../api/likeService/getLikersUserid");
const getLikesCount = require("../api/likeService/getLikesCount");
const likeUnlikePost = require("../api/likeService/likeUnlikePost");
const likeState = require("../api/likeService/likeState");

router.use("/lb", getLikersUserid);
router.use("/lc", getLikesCount);
router.use("/lu", likeUnlikePost);
router.use("/ls", likeState);

module.exports = router;
