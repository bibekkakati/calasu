const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(
  __dirname + "/proto/profile.proto",
  {}
);
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const ProfilePackage = grpcObject.ProfilePackage;

// Client connection
const client = new ProfilePackage.Profile(
  "localhost:8000",
  grpc.credentials.createInsecure()
);

getProfile = (res, userid) => {
  client.getProfile(
    {
      userid: userid,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
      }
      res.send(response);
    }
  );
};

getUser = (res, userid) => {
  client.getUser(
    {
      userid: userid,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
      }
      res.send(response);
    }
  );
};

updateProfile = (res, userid, name) => {
  client.updateProfile(
    {
      userid: userid,
      name: name,
    },
    (err, response) => {
      if (err) {
        res.send({ success: false });
      }
      res.send(response);
    }
  );
};

module.exports = {
  getProfile,
  updateProfile,
  getUser,
};
