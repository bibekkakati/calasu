const router = require("express").Router();
const { updateProfile } = require("../../services/profileService/client");

router.put("/", (req, res) => {
  const userid = req.headers.authorization;
  const { name } = req.body;
  if (userid && name) {
    updateProfile(res, userid, name);
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
