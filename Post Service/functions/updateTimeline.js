const deleteQueueMessage = require("../queue/deleteQueueMessage");
const { sendToNF_PostInsert } = require("../queue/sendQueueMessage");
const dbQuery = require("../db/query");
const { s3 } = require("../s3/s3");
const { addToPersonalTimeline } = require("../redis/query");

const updateTimeline = (message, sqs, delParams) => {
  var msg = JSON.parse(message).Records["0"];
  if (msg.eventName === "ObjectCreated:Put") {
    const bucket = msg.s3.bucket.name;
    const key = msg.s3.object.key;
    const url = `https://${bucket}.s3.${msg.awsRegion}.amazonaws.com/${key}`;
    s3.headObject({ Bucket: bucket, Key: key }, (err, data) => {
      if (err) {
        //FIXME: error logs;

        return;
      } else {
        const { userid, timestamp } = data.Metadata;
        if (bucket === process.env.PHOTO_BUCKET) {
          dbQuery
            .updatePhotoPostUrl(key, url, userid)
            .then((res) => {
              if (res.rowCount) {
                addToPersonalTimeline(userid, [timestamp, key]);
                // send to newsfeed service through queue
                sendToNF_PostInsert({ userid, postid: key, timestamp })
                  .then((ok) => {
                    deleteQueueMessage(sqs, delParams);
                  })
                  .catch((err) => {});
              }
            })
            .catch((err) => {
              //FIXME: error logs
            });
        } else if (bucket === process.env.BLOG_BUCKET) {
          dbQuery
            .updateBlogUrl(key, url, userid)
            .then((res) => {
              if (res.rowCount) {
                addToPersonalTimeline(userid, [timestamp, key]);
                // send to newsfeed service through queue
                sendToNF_PostInsert({ userid, postid: key, timestamp })
                  .then((ok) => {
                    deleteQueueMessage(sqs, delParams);
                  })
                  .catch((err) => {});
              }
            })
            .catch((err) => {
              //FIXME: error logs
            });
        } else if (bucket === process.env.BLOG_IMAGE_BUCKET) {
          dbQuery
            .updateBlogImageUrl(key, url, userid)
            .then((res) => {
              if (res.rowCount) {
                deleteQueueMessage(sqs, delParams);
              }
            })
            .catch((err) => {
              //FIXME: error logs
            });
        } else {
          deleteQueueMessage(sqs, delParams);
        }
      }
    });
  }
};

module.exports = updateTimeline;
