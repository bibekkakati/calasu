const dbQuery = require("./../db/query");
const getSignedUrl = require("../s3/getSignedUrl");
const { updatePostMetaDataCache } = require("../redis/query");

const updateBlog = (call, callback) => {
  var { userid, postid, title, category, getBlogPostUrl } = call.request;
  if (userid && postid && title) {
    if (getBlogPostUrl) {
      getSignedUrl(process.env.BLOG_BUCKET, postid, userid)
        .then((url) => {
          updateIntoDatabase(userid, postid, title, category, url, callback);
        })
        .catch((e) => {
          callback(null, {
            success: false,
          });
        });
    } else {
      updateIntoDatabase(userid, postid, title, category, "", callback);
    }
  } else {
    callback(null, {
      success: false,
    });
  }
};

const updateIntoDatabase = (userid, postid, title, category, url, callback) => {
  dbQuery
    .updateBlog(userid, postid, title, category)
    .then((res) => {
      if (res.rowCount) {
        updatePostMetaDataCache(postid, { title, category });
        callback(null, {
          success: true,
          blogPostUrl: url,
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

module.exports = updateBlog;
