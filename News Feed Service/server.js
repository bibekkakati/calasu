require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/newsFeed.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const NewsFeedPackage = grpcObject.NewsFeedPackage;

//CASSANDRA DB CONNECTION
const db = require("./db/db");
db.dbConnect();

// REDIS CONNECTION
require("./redis/redis");

// SQS LONG POLLING INITIAL START
const { startPollingQueue } = require("./queue/receiveQueueMessage");
setTimeout(() => {
  startPollingQueue();
}, 20000);

//API ROUTES
const getNewsFeed = require("./api/getNewsFeed");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = process.env.PORT || 9000;
server.addService(NewsFeedPackage.NewsFeed.service, {
  getNewsFeed,
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
  await redisNewsFeedClient.quit();
  await redisFollowersClient.quit();
  await db.getClient().shutdown();
  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
