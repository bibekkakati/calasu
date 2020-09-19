const router = require("express").Router();
const { authenticateUser } = require("../../services/authService/client");

router.post("/", (req, res) => {
  if (req.body.idToken) {
    authenticateUser(res, req.body.idToken);
  } else {
    res.send({ success: false });
  }
});

module.exports = router;
