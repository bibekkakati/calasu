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

var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
var params_post = {
  QueueUrl: process.env.SQS_POST_URL,
  WaitTimeSeconds: 20,
};

module.exports = {
  sqs,
  params_post,
};
