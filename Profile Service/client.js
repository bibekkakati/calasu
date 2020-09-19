const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/profile.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const ProfilePackage = grpcObject.ProfilePackage;

// Client connection
const client = new ProfilePackage.Profile(
  "localhost:8000",
  grpc.credentials.createInsecure()
);

// client.getProfile(
//   {
//     userid: "104335960404702176509",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log("Recieved from server " + JSON.stringify(response));
//   }
// );

// client.updateProfile(
//   {
//     userid: "104335960404702176509",
//     name: "sagar Kakati",
//     picture: "new picture url",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log("Recieved from server " + JSON.stringify(response));
//   }
// );
