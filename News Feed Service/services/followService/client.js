const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/follow.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const FollowPackage = grpcObject.FollowPackage;

// Client connection
const client = new FollowPackage.Follow(
  "localhost:4200",
  grpc.credentials.createInsecure()
);

const getFollowers = (userid) => {
  return new Promise((resolve, reject) => {
    client.getFollowers(
      {
        userid: userid,
      },
      (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      }
    );
  });
};

module.exports = {
  getFollowers,
};
