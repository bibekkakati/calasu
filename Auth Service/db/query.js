const { query } = require("./db");

const dbInsert = {
  user_auth_table: (userid, mailid) => {
    var last_login = Date.now();
    return new Promise((resolve, reject) => {
      query(
        "INSERT INTO user_auth_table(userid, mailid, last_login) VALUES($1, $2, $3)",
        [userid, mailid, last_login],
        (err, res) => {
          if (err) {
            reject(err);
            //FIXME: error logs
          } else {
            resolve(res);
          }
        }
      );
    });
  },
};

const dbUpdate = {
  user_auth_table: (userid) => {
    var last_login = Date.now();
    query(
      "UPDATE user_auth_table SET last_login = ($1) WHERE userid = ($2)",
      [last_login, userid],
      (err, res) => {
        if (err) {
          //FIXME: error logs
        }
      }
    );
  },
};

module.exports = {
  dbInsert,
  dbUpdate,
};
