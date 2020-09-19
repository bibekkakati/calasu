const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("proto/auth.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const AuthPackage = grpcObject.AuthPackage;

// Client connection
const client = new AuthPackage.Auth(
  "localhost:3000",
  grpc.credentials.createInsecure()
);

console.log(client);

// client.authenticateUser(
//   {
//     idToken:
//       "eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2M2VlMGJlMDkzZDliYzMxMmQ5NThjOTk2NmQyMWYwYzhmNmJiYmIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNTk1MDAzOTE2NTYtbTcwMmhxZzU5Y3JmbGVzaTU3djd2YmphZDNkN2Mwa24uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNTk1MDAzOTE2NTYtbTcwMmhxZzU5Y3JmbGVzaTU3djd2YmphZDNkN2Mwa24uYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA5OTE5MTM4MDQzMDIwNTg2NzQiLCJlbWFpbCI6ImJpYmVra2FrYXRpMkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImYyWTJYb0luNGJoa3lBNzFXcUJIS0EiLCJuYW1lIjoiQklCRUsgS0FLQVRJIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdocnphWFhmVGNSRVQ1b2VYbnp3M2ZVbGRIcHI5Nk96c3FYalZGZz1zOTYtYyIsImdpdmVuX25hbWUiOiJCSUJFSyIsImZhbWlseV9uYW1lIjoiS0FLQVRJIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE1OTU4MDc0MTgsImV4cCI6MTU5NTgxMTAxOH0.iSmgEVdHC4P5o68sAXJyJODTQJ3POVmOWT9B2Nk3Y01UtfcDix2PcWGkATsfibHMG88eF5dnViQR0tfVqZbEQs8ZWmu6o3UHFqEOM6Xp9x-cfTVDrQZoIITvvJ16Hn7wLR1BtB6PQaOsrIyVCzhh5yKiTKAUrKNu_s1QT0l_Sin8xIAgf7e88iPKhz6pBwrykl3_HACpcDSEiGAvjEpk49nc4_Axv_F7Q7G_smwriwB_PHuAQ3zKajknFx_w7ZeNoDYZlaR9cGpQ-PCXN5xKD0zI4SAH17EL659OmQWWa1L6Qj4s-b04zHq5Lc1n-bDkvOGy43agh_qR0615Amms7w",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log("Recieved from server " + JSON.stringify(response));
//   }
// );

// client.reissueToken(
//   {
//     id: "117854963284",
//     email: "bibekkakati0@gmail.com",
//   },
//   (err, response) => {
//     if (err) throw err;
//     console.log("Recieved from server " + JSON.stringify(response));
//   }
// );
