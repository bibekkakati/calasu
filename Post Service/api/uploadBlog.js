const getSignedUrl = require("../s3/getSignedUrl");
const dbQuery = require("../db/query");
const { sendToProfileService } = require("../queue/sendQueueMessage");
const { v4: uuidv4 } = require("uuid");

const uploadBlog = (call, callback) => {
  var postId = "blg" + uuidv4();
  var { userid, title, category, getImagePostUrl } = call.request;
  const timestamp = Date.now();
  if (userid && title) {
    if (getImagePostUrl) {
      Promise.all([
        getSignedUrl(process.env.BLOG_BUCKET, postId, userid, timestamp),
        getSignedUrl(process.env.BLOG_IMAGE_BUCKET, postId, userid, timestamp),
      ])
        .then((result) => {
          insertIntoDatabase(
            postId,
            userid,
            title,
            category,
            result[1],
            result[0],
            timestamp,
            callback
          );
        })
        .catch((e) => {
          //FIXME: send error logs
          callback(null, {
            success: false,
          });
        });
    } else {
      getSignedUrl(process.env.BLOG_BUCKET, postId, userid, timestamp)
        .then((url) => {
          if (!url) {
            callback(null, {
              success: false,
            });
          } else {
            insertIntoDatabase(
              postId,
              userid,
              title,
              category,
              "",
              url,
              timestamp,
              callback
            );
          }
        })
        .catch((e) => {
          callback(null, {
            success: false,
          });
        });
    }
  } else {
    callback(null, {
      success: false,
    });
  }
};

const insertIntoDatabase = (
  postId,
  userid,
  title,
  category,
  imagePostUrl,
  blogPostUrl,
  timestamp,
  callback
) => {
  dbQuery
    .uploadBlog(postId, userid, title, category, timestamp)
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
          blogPostUrl,
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

module.exports = uploadBlog;
