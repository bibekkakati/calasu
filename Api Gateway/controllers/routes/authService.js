const express = require("express");
const router = express.Router();

// ALL AUTH SERVICE API'S
const authenticateUser = require("../api/authService/authenticateUser");

router.use("/authenticateuser", authenticateUser);

module.exports = router;
