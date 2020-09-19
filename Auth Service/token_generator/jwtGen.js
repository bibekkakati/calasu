const jwt = require("jsonwebtoken");
const fs = require("fs");

// JSON-WEB-TOKEN generator
jwtGenerator = (payload, callback) => {
  var privateKey = fs.readFileSync("./keys/rsa_private.pem");
  jwt.sign(
    payload,
    privateKey,
    { algorithm: process.env.JWT_ALGO, expiresIn: 60 * 60 * 24 * 5 },
    (err, token) => {
      if (err) {
        callback(null, {
          success: false,
          token: "",
        });
      } else {
        callback(null, {
          success: true,
          token: "Bearer " + token,
        });
      }
    }
  );
};

module.exports = {
  jwtGenerator,
};
