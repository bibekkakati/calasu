const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/like.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const LikePackage = grpcObject.LikePackage;

// Client connection
const client = new LikePackage.Like(
  "localhost:6000",
  grpc.credentials.createInsecure()
);

getLikersUserid = (res, postid) => {
  client.getLikersUserid({ postid }, (err, response) => {
    if (err) {
      return res.send({
        success: false,
      });
    }
    res.send(response);
  });
};

getLikesCount = (res, postid) => {
  client.getLikesCount({ postid }, (err, response) => {
    if (err) {
      return res.send({
        success: false,
      });
    }
    res.send(response);
  });
};

getLikeState = (res, userid, postid) => {
  client.getLikeState({ userid, postid }, (err, response) => {
    if (err) {
      return res.send({
        success: false,
      });
    }
    res.send(response);
  });
};

module.exports = {
  getLikersUserid,
  getLikesCount,
  getLikeState,
};
