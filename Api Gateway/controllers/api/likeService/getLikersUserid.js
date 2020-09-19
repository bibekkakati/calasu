const router = require("express").Router();
const { getLikersUserid } = require("../../services/likeService/client");

router.get("/:postid", (req, res) => {
  const postid = req.params.postid;
  const offset = parseInt(req.query.offset);
  if (isNaN(offset)) return res.send({ success: false });
  var end = offset + 15;

  if (postid && offset >= 0) {
    redisClientFollowers.zrevrange(postid, offset, end, (err, list) => {
      if (err || (list === null)) {
        return getLikersUserid(res, postid);
      }

      if (list.length) {
        res.send({
          success: true,
          userids: list,
        });
      } else {
        return getLikersUserid(res, postid);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
