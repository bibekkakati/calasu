const dbQuery = require("./../db/query");
const { addToPostMetaDataCache } = require("../redis/query");

const getPost = (call, callback) => {
  //userid == requestedBy
  var { postid, userid } = call.request;
  if (postid && userid) {
    dbQuery
      .getPostById(postid)
      .then((res) => {
        if (res.rowCount) {
          var data = res.rows[0];
          data = {
            postid: data.postid,
            userid: data.userid,
            title: data.title,
            category: data.category,
            imageUrl: data.imageUrl,
            blogUrl: data.blogUrl,
            views: data.views,
            likes: data.likes,
            timestamp: data.timestamp,
          };
          for (const field in data) {
            data[field] === undefined && delete data[field];
          }
          addToPostMetaDataCache(postid, data);
          callback(null, {
            success: true,
            ...data,
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
  } else {
    callback(null, {
      success: false,
    });
  }
};

module.exports = getPost;
