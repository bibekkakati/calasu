const router = require("express").Router();
const { getLikeState } = require("../../services/likeService/client");

router.get("/:postid", (req, res) => {
  const postid = req.params.postid;
  const userid = req.headers.authorization;
  if (postid) {
    redisClientLike.zscore(userid, postid, (err, ok) => {
      if (err) {
        return getLikeState(res, userid, postid);
      }
      if (ok) {
        res.send({
          success: true,
          liked: true,
        });
      } else {
        res.send({
          success: true,
          liked: false,
        });
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
