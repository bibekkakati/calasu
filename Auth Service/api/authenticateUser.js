const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.APP_CLIENT_ID);
const { dbInsert, dbUpdate } = require("../db/query");
const { jwtGenerator } = require("../token_generator/jwtGen");
const { sendToCreateProfileQueue } = require("../queue/sendQueueMessage");

authenticateUser = async (call, callback) => {
  const idToken = call.request.idToken;

  // VERIFY THE IDTOKEN WITH GOOGLE
  client
    .verifyIdToken({
      idToken: idToken,
      audience: process.env.APP_CLIENT_ID,
    })
    .then(async (ticket) => {
      const payload = ticket.getPayload();

      if (payload["aud"] === process.env.APP_CLIENT_ID) {
        // CREATE ACCOUNT IF DOESN'T EXIST
        signUp_logIn(callback, payload);
      } else {
        callback(null, {
          success: false,
          token: "",
        });
      }
    })
    .catch((err) => {
      if (err) {
        callback(null, {
          success: false,
          token: "",
        });
      }
    });
};

// FUNCTION TO CHECK IF ID EXISTS IN DATABASE
signUp_logIn = (callback, payload) => {
  const { sub, email, name, picture } = payload;
  var username = email.split("@")[0];
  const jwtPayload = {
    id: sub,
    email: email,
  };

  dbInsert
    .user_auth_table(sub, email)
    .then((res) => {
      if (res.rowCount) {
        // ISSUE JWT - LOGIN
        jwtGenerator(jwtPayload, callback);

        // SEND DATA TO PROFILE SERVICE THROUGH MESSAGE QUEUE
        sendToCreateProfileQueue({ ...jwtPayload, picture, name, username });
      } else {
        callback(null, {
          success: false,
          token: "",
        });
      }
    })
    .catch((err) => {
      if (err.code == 23505) {
        //ID ALREADY EXISTS SO LOGIN
        jwtGenerator(jwtPayload, callback);

        dbUpdate.user_auth_table(sub);
      } else {
        callback(null, {
          success: false,
          token: "",
        });
      }
    });
};

module.exports = authenticateUser;
