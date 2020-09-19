const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/follow.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const FollowPackage = grpcObject.FollowPackage;

// Client connection
const client = new FollowPackage.Follow(
  "localhost:4200",
  grpc.credentials.createInsecure()
);

// client.getFollowers(
//   {
//     userid: "1",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log(response);
//   }
// );

// client.getFollowings(
//   {
//     userid: "1",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log("Recieved from server ", response);

//   }
// );
