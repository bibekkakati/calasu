require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/like.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const LikePackage = grpcObject.LikePackage;

//CASSANDRA DB CONNECTION
const db = require("./db/db");

// REDIS CONNECTION
require("./redis/redis");

// SQS LONG POLLING INITIAL START
const { startPollingQueue } = require("./queue/receiveQueueMessage");
startPollingQueue();

//API ROUTES
const getLikersUserid = require("./api/getLikersUserid");
const getLikesCount = require("./api/getLikesCount");
const getLikeState = require("./api/getLikeState");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = process.env.PORT || 6000;
server.addService(LikePackage.Like.service, {
  getLikersUserid,
  getLikesCount,
  getLikeState,
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
  await redisLikeClient.quit();
  const pool = db.getPool();
  await pool.end();

  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
