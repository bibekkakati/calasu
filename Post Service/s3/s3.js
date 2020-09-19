var AWS = require("aws-sdk");

const https = require("https");
const agent = new https.Agent({
  keepAlive: true,
  maxSockets: Infinity,
});

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "ap-south-1",
  httpOptions: {
    agent,
  },
});

var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

module.exports = {
  s3,
};
