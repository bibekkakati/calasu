const router = require("express").Router();
const { getUser } = require("../../services/profileService/client");

router.get("/:userid", (req, res) => {
  const userid = req.params.userid;
  if (userid) {
    redisClientProfile.hmget(
      userid,
      "username",
      "name",
      "picture",
      (err, object) => {
        if (object[0] || object[1] || object[2]) {
          return res.send({
            success: true,
            username: object[0],
            name: object[1],
            picture: object[2],
          });
        } else {
          getUser(res, userid);
        }
      }
    );
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
