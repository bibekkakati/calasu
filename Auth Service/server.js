require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/auth.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const AuthPackage = grpcObject.AuthPackage;

//POSTGRESQL CONNECTION
const db = require("./db/db");

//API ROUTES
const authenticateUser = require("./api/authenticateUser");
const reissueToken = require("./api/reissueToken");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = process.env.PORT || 3000;
server.addService(AuthPackage.Auth.service, {
  authenticateUser: authenticateUser,
  reissueToken: reissueToken,
});
server.bindAsync(
  "0.0.0.0:" + PORT,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (!err) {
      server.start();
    }
  }
);

handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly.`);
  const pool = db.getPool();
  await pool.end();
  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
