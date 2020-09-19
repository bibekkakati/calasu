const router = require("express").Router();
const { getLikesCount } = require("../../services/likeService/client");

router.get("/:postid", (req, res) => {
  const postid = req.params.postid;

  if (postid) {
    redisClientFollowers.zcard(postid, (err, count) => {
      if (err) {
        return getLikesCount(res, postid);
      } else if (count >= 0) {
        res.send({
          success: true,
          likes: count,
        });
      } else {
        return getLikesCount(res, postid);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
