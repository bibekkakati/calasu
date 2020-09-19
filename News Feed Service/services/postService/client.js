const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/post.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const PostPackage = grpcObject.PostPackage;

// Client connection
const client = new PostPackage.Post(
  "localhost:5000",
  grpc.credentials.createInsecure()
);

const getPostsByUserid = (userid, offset, limit) => {
  return new Promise((resolve, reject) => {
    client.getTimelineByUserId(
      {
        userid: userid,
        offset: offset,
        limit: limit,
      },
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      }
    );
  });
};

module.exports = {
  getPostsByUserid,
};
