const router = require("express").Router();
const { getFollowState } = require("../../services/followService/client");

router.get("/:userid", (req, res) => {
  const otherUserId = req.params.userid;
  const userid = req.headers.authorization;
  if (otherUserId) {
    redisClientFollowings.zscore(userid, otherUserId, (err, ok) => {
      if(err){
        return getFollowState(res, userid, otherUserId);
      }
      if (ok) {
        res.send({
          success: true,
          following: true,
        });
      } else {
        res.send({
          success: true,
          following: false,
        });
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
