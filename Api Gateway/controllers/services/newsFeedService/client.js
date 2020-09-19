const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/newsFeed.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const NewsFeedPackage = grpcObject.NewsFeedPackage;

// Client connection
const client = new NewsFeedPackage.NewsFeed(
  "localhost:9000",
  grpc.credentials.createInsecure()
);

getNewsFeed = (res, userid, timestamp) => {
  client.getNewsFeed({ userid, timestamp }, (err, response) => {
    if (err) {
      res.send({
        success: false,
      });
    }
    res.send(response);
  });
};

module.exports = {
  getNewsFeed,
};
