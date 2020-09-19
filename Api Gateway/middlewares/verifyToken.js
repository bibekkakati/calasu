const jwt = require("jsonwebtoken");
const fs = require("fs");
var publicKey = fs.readFileSync("./keys/rsa_public.pem");
const { reissueToken } = require("../controllers/services/authService/client");

verifyToken = (req, res, next) => {
  var token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.substring(7, token.length);
    //FIXME: *****************
    var decoded = jwt.decode(token);
    req.headers.authorization = decoded.id;
    next();
    return;
    //**************************
    jwt.verify(
      token,
      publicKey,
      { algorithms: [process.env.JWT_ALGO] },
      (err, payload) => {
        if (err) {
          if (
            err.message === "jwt expired" &&
            err.expiredAt >= Date.now() - 86400000 * 2
          ) {
            var decoded = jwt.decode(token);
            reissueToken(res, decoded.id, decoded.email);
          } else {
            res.status(401).send({ success: false, token: "" });
          }
        } else {
          req.headers.authorization = payload.id;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ success: false, token: "" });
  }
};

module.exports = verifyToken;
