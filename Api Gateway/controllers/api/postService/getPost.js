const router = require("express").Router();
const { getPost } = require("../../services/postService/client");

router.get("/:postid", (req, res) => {
  const postid = req.params.postid;
  const userid = req.headers.authorization;
  if (postid && userid) {
    redisClientPosts.hgetall(postid, (err, object) => {
      if (object) {
        return res.send({
          success: true,
          ...object,
        });
      } else {
        getPost(res, userid, postid);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
