const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/auth.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const AuthPackage = grpcObject.AuthPackage;

// Client connection
const client = new AuthPackage.Auth(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

authenticateUser = (res, idToken) => {
  client.authenticateUser({ idToken: idToken }, (err, response) => {
    if (err) {
      res.send({
        success: false,
        token: "",
      });
    }
    res.send(response);
  });
};

reissueToken = (res, id, email) => {
  client.reissueToken({ id: id, email: email }, (err, response) => {
    if (err) {
      res.send({
        success: false,
        token: "",
      });
    }
    res.send(response);
  });
};

module.exports = {
  authenticateUser,
  reissueToken,
};
