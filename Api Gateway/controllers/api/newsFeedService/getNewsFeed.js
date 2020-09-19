const router = require("express").Router();
const { getNewsFeed } = require("../../services/newsFeedService/client");

router.get("/", (req, res) => {
  const userid = req.headers.authorization;
  const timestamp = parseInt(req.query.timestamp); //its a timestamp
  const offset = parseInt(req.query.offset);
  if (isNaN(offset) || isNaN(timestamp)) return res.send({ success: false });
  var end = offset + 10;
  if (userid) {
    redisClientNewsFeed.zrevrange(userid, offset, end, (err, postids) => {
  
      if (err || (postids === null)) return getNewsFeed(res, userid, timestamp);
      if (postids.length) {
        return res.send({
          success: true,
          postids,
        });
      } else {
        return getNewsFeed(res, userid, timestamp);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
