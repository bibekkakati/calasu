require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/profile.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const ProfilePackage = grpcObject.ProfilePackage;

//POSTGRESQL CONNECTION
const db = require("./db/db");

// REDIS CONNECTION
require("./redis/redis");

// SQS LONG POLLING INITIAL START
const { startPollingQueue } = require("./queue/receiveQueueMessage");
startPollingQueue();

//API ROUTES
const getProfile = require("./api/getProfile");
const updateProfile = require("./api/updateProfile");
const getUser = require("./api/getUser");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = process.env.PORT || 8000;

server.addService(ProfilePackage.Profile.service, {
  getProfile: getProfile,
  updateProfile: updateProfile,
  getUser: getUser,
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
  await redisClient.quit();
  const pool = db.getPool();
  await pool.end();
  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
