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

getFollowers = (res, userid) => {
  client.getFollowers(
    {
      userid: userid,
    },
    (err, response) => {
      if (err) {
        res.status(400).send({ success: false });
      } else {
        res.send(response);
      }
    }
  );
};

getFollowings = (res, userid) => {
  client.getFollowings(
    {
      userid: userid,
    },
    (err, response) => {
      if (err) {
        res.status(400).send({ success: false });
      } else {
        res.send(response);
      }
    }
  );
};

getFollowState = (res, userid, otherUserId) => {
  client.getFollowState(
    {
      userid: userid,
      otherUserId: otherUserId,
    },
    (err, response) => {
      if (err) {
        res.status(400).send({ success: false });
      } else {
        res.send(response);
      }
    }
  );
};

module.exports = {
  getFollowers,
  getFollowings,
  getFollowState,
};
