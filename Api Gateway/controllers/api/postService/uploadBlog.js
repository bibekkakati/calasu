const router = require("express").Router();
const { uploadBlog } = require("../../services/postService/client");

router.post("/", (req, res) => {
  const userid = req.headers.authorization;
  const { title, category, getImagePostUrl } = req.body;
  if (userid && title) {
    uploadBlog(res, userid, title, category, getImagePostUrl);
  } else {
    res.send({ success: false, });
  }
});

module.exports = router;
