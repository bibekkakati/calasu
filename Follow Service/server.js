require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/follow.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const FollowPackage = grpcObject.FollowPackage;

//NEO4J DB CONNECTION
const db = require("./db/db");

// REDIS CONNECTION
require("./redis/redis");

// SQS LONG POLLING INITIAL START
const { startPollingQueue } = require("./queue/receiveQueueMessage");
startPollingQueue();

//API ROUTES
const getFollowers = require("./api/getFollowers");
const getFollowings = require("./api/getFollowings");
const getFollowState = require("./api/getFollowState");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = process.env.PORT || 4200;
server.addService(FollowPackage.Follow.service, {
  getFollowers,
  getFollowings,
  getFollowState,
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
  await redisClientFollowings.quit();
  await redisClientFollowers.quit();
  const pool = db.getPool();
  await pool.end();
  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
