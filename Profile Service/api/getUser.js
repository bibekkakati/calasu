const { dbRead } = require("../db/query");
const { setUserDataInRedis } = require("../redis/query");

getUser = (call, callback) => {
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
          username: username,
          name: name,
          picture: picture,
        });
      } else {
        callback(null, {
          success: false,
          username: "",
          name: "",
          picture: "",
        });
      }
    })
    .catch((err) => {
      callback(null, {
        success: false,
        username: "",
        name: "",
        picture: "",
      });
    });
};

module.exports = getUser;
