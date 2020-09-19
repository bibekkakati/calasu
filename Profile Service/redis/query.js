setUserDataInRedis = (userid, data) => {
  redisClient.hmset(userid, data, (err, ok) => {
    if (err) {
      //FIXME: ERROR LOGS
    }
  });
};

updateUserDataInRedisIfExists = (userid, data) => {
  setUserDataInRedis(userid, data);
};

incrby = (userid, field) => {
  redisClient.hincrby(userid, field, 1, (err, reply) => {
    if (err) {
      redisClient.del(userid, (err, ok) => {
        if (err) {
          //FIXME: send to error logs
        }
      });
    }
  });
};

decrby = (userid, field, value = -1) => {
  redisClient.hincrby(userid, field, value, (err, reply) => {
    if (err) {
      redisClient.del(userid, (err, ok) => {
        if (err) {
          //FIXME: send to error logs
        }
      });
    }
  });
};

module.exports = {
  setUserDataInRedis,
  updateUserDataInRedisIfExists,
  incrby,
  decrby,
};
