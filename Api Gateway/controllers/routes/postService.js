const express = require("express");
const router = express.Router();

// ALL POST SERVICE API'S
const getPost = require("../api/postService/getPost");
const getTimelineByUserId = require("../api/postService/getTimelineByUserId");

const uploadBlog = require("../api/postService/uploadBlog");
const uploadPhoto = require("../api/postService/uploadPhoto");

const updateBlog = require("../api/postService/updateBlog");
const deletePost = require("../api/postService/deletePost");

router.use("", getPost);
router.use("/timeline", getTimelineByUserId);
router.use("/blog", uploadBlog);
router.use("/photo", uploadPhoto);
router.use("/blog", updateBlog);
router.use("", deletePost);

module.exports = router;
