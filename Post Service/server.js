require("dotenv").config();

//GRPC AND PROTO
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/post.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const PostPackage = grpcObject.PostPackage;

//PG DB CONNECTION
const db = require("./db/db");

// REDIS CONNECTION
require("./redis/redis");

// SQS LONG POLLING INITIAL START
const { startPollingQueue } = require("./queue/receiveQueueMessage");
startPollingQueue();

//API ROUTES
const getPost = require("./api/getPost");
const uploadBlog = require("./api/uploadBlog");
const uploadPhoto = require("./api/uploadPhoto");
const deletePost = require("./api/deletePost");
const updateBlog = require("./api/updateBlog");
const getTimelineByUserId = require("./api/getTimelineByUserId");

//GRPC SERVER CONNECTION
const server = new grpc.Server();
const PORT = 5000;
server.addService(PostPackage.Post.service, {
  getPost,
  deletePost,
  updateBlog,
  uploadBlog,
  uploadPhoto,
  getTimelineByUserId,
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

const handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly.`);
  await redisPostClient.quit();
  const pool = db.getPool();
  await pool.end();

  server.tryShutdown((err) => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
