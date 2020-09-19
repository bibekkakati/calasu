const { s3 } = require("./s3");

const getSignedUrl = (bucket, filename, userid, timestamp) => {
  const timestampStr = `${timestamp}`;
  return new Promise((resolve, reject) => {
    if (!(bucket && filename)) {
      reject("Empty parameters");
    } else {
      var params = {
        Bucket: bucket,
        Key: filename,
        ACL: "public-read",
        Expires: 600,
        Metadata: {
          userid,
          timestamp: timestampStr,
        },
      };
      s3.getSignedUrl("putObject", params, function (err, url) {
        if (err) reject(err);
        else resolve(url);
      });
    }
  });
};

module.exports = getSignedUrl;
