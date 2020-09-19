const router = require("express").Router();
const { updateBlog } = require("../../services/postService/client");

router.put("/:postid", (req, res) => {
  const postid = req.params.postid;
  const userid = req.headers.authorization;
  const { title, category, getBlogPostUrl } = req.body;
  if (userid && postid && title) {
    updateBlog(res, userid, postid, title, category, getBlogPostUrl);
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
