const router = require("express").Router();
const { uploadPhoto } = require("../../services/postService/client");

router.post("/", (req, res) => {
  const userid = req.headers.authorization;
  const { category } = req.body;

  if (userid) {
    uploadPhoto(res, userid, category);
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
