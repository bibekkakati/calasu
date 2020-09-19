const router = require("express").Router();
const { getProfile } = require("../../services/profileService/client");

router.get("/:userid", (req, res) => {
  const userid = req.params.userid;
  if (userid) {
    redisClientProfile.hgetall(userid, (err, object) => {
      if (object) {
        return res.send({
          success: true,
          ...object,
        });
      } else {
        getProfile(res, userid);
      }
    });
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
