const getSignedUrl = require("../s3/getSignedUrl");
const dbQuery = require("../db/query");
const { sendToProfileService } = require("../queue/sendQueueMessage");
const { v4: uuidv4 } = require("uuid");

const uploadPhoto = (call, callback) => {
  var postId = "pht" + uuidv4();
  var { userid, category } = call.request;
  const timestamp = Date.now();
  if (userid) {
    getSignedUrl(process.env.PHOTO_BUCKET, postId, userid, timestamp)
      .then((url) => {
        if (!url) {
          callback(null, {
            success: false,
          });
        } else {
          insertIntoDatabase(
            postId,
            userid,
            category,
            url,
            timestamp,
            callback
          );
        }
      })
      .catch((e) => {
        //FIXME: send error logs
        callback(null, {
          success: false,
        });
      });
  } else {
    callback(null, {
      success: false,
    });
  }
};

const insertIntoDatabase = (
  postId,
  userid,
  category = "",
  imagePostUrl,
  timestamp,
  callback
) => {
  dbQuery
    .uploadPhoto(postId, userid, category, timestamp)
    .then((res) => {
      if (res.rowCount) {
        sendToProfileService({
          Type: "posts",
          act: "posted",
          id: userid,
          value: 1,
        });
        callback(null, {
          success: true,
          imagePostUrl,
        });
      } else {
        callback(null, {
          success: false,
        });
      }
    })
    .catch((e) => {
      callback(null, {
        success: false,
      });
    });
};

module.exports = uploadPhoto;
