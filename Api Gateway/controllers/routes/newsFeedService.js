const express = require("express");
const router = express.Router();

// ALL NEWS FEED SERVICE API'S
const getNewsFeed = require("../api/newsFeedService/getNewsFeed");

router.use("", getNewsFeed);

module.exports = router;
