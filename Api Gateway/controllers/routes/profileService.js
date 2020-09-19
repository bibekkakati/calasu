const express = require("express");
const router = express.Router();

// ALL FOLLOW SERVICE API'S
const getProfile = require("../api/profileService/getProfile");
const updateProfile = require("../api/profileService/updateProfile");
const getUser = require("../api/profileService/getUser");

router.use("", getProfile);
router.use("", updateProfile);
router.use("/user", getUser);

module.exports = router;
