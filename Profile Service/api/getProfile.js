const { dbRead } = require("../db/query");
const { setUserDataInRedis } = require("../redis/query");

getProfile = (call, callback) => {
  var userid = call.request.userid;

  dbRead
    .user_profile_table_full(userid)
    .then((res) => {
      if (res.rowCount) {
        const {
          username,
          name,
          picture,
          followers,
          followings,
          likes,
          posts,
          views,
        } = res.rows[0];
        setUserDataInRedis(userid, {
          username,
          name,
          picture,
          followers,
          followings,
          likes,
          posts,
          views,
        });
        callback(null, {
          success: true,
          username,
          name,
          picture,
          followers,
          followings,
          likes,
          posts,
          views,
        });
      } else {
        callback(null, {
          success: false,
          username: "",
          name: "",
          picture: "",
          followers: 0,
          followings: 0,
          likes: 0,
          posts: 0,
          views: 0,
        });
      }
    })
    .catch((err) => {
      callback(null, {
        success: false,
        username: "",
        name: "",
        picture: "",
        followers: 0,
        followings: 0,
        likes: 0,
        posts: 0,
        views: 0,
      });
    });
};

module.exports = getProfile;
