const router = require("express").Router();
const {
  sendToLikePostQueue,
  sendToUnlikePostQueue,
} = require("../../../queue/sendQueueMessage");

router.post("/:postid", (req, res) => {
  const action = req.query.action;
  const userid = req.headers.authorization;
  const postid = req.params.postid;

  if (action === "like") {
    return sendToLikePostQueue(res, { postid, userid });
  } else if (action === "unlike") {
    return sendToUnlikePostQueue(res, { postid, userid });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
