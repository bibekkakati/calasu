const { dbInsert } = require("../../db/query");
const deleteQueueMessage = require("../../queue/deleteQueueMessage");

createProfile = (msg, sqs, delParams) => {
  var { id, email, name, username, picture } = msg;
  name = titleCase(name);
  var created_at = Date.now();
  dbInsert
    .user_profile_table(
      id,
      username,
      email,
      name,
      picture,
      created_at,
      created_at
    )
    .then((res) => {
      if (res.rowCount) {
        //delete the message from SQS
        deleteQueueMessage(sqs, delParams);
      }
    })
    .catch((err) => {
      if (err.code == 23505) {
        deleteQueueMessage(sqs, delParams);
      } else {
        //FIXME: send error log to internal error handling service
      }
    });
};

titleCase = (str) => {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

module.exports = createProfile;
