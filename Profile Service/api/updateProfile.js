const { dbUpdate } = require("../db/query");
const { updateUserDataInRedisIfExists } = require("../redis/query");

updateProfile = (call, callback) => {
  var { userid, name } = call.request;
  if(name && userid){
    dbUpdate
    .user_profile_table(userid, name)
    .then((res) => {
      if (res.rowCount) {
        updateUserDataInRedisIfExists(userid, { name });
        callback(null, {
          success: true,
        });
      } else {
        callback(null, {
          success: false,
        });
      }
    })
    .catch((err) => {
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

module.exports = updateProfile;
