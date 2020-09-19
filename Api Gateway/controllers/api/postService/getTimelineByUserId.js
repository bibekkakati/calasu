const router = require("express").Router();
const { getTimelineByUserId } = require("../../services/postService/client");

router.get("/:userid", (req, res) => {
  const userid = req.params.userid;
  const offset = parseInt(req.query.offset);
  if(isNaN(offset)) return res.send({ success: false });
  var end = offset + 5;
  if (userid && offset >= 0) {
    redisClientTimeline.zrevrange(userid, offset, end, (err, postids) => {
      if(err || (postids === null)) return getTimelineByUserId(res, userid, offset, 10);
      if (postids.length) {
        return res.send({
          success: true,
          posts: postids,
        });
      } else {
        return getTimelineByUserId(res, userid, offset, 10);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
