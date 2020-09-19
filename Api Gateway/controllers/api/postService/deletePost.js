const router = require("express").Router();
const { deletePost } = require("../../services/postService/client");

router.delete("/:postid", (req, res) => {
  const postid = req.params.postid;
  const userid = req.headers.authorization;
  if (postid && userid) {
    deletePost(res, userid, postid);
  } else {
    res.send({ success: false });
  }
});
module.exports = router;
