const { jwtGenerator } = require("../token_generator/jwtGen");

reissueToken = (call, callback) => {
  var payload = {
    id: call.request.id,
    email: call.request.email,
  };
  jwtGenerator(payload, callback);
};

module.exports = reissueToken;
