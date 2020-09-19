addToRedisFollowingsList = (userid, data) => {
  redisClientFollowings.zadd(userid, data, (err, ok) => {
    if (err) {
      //FIXME: ERROR LOGS
    }
  });
};

addToRedisFollowersList = (userid, data) => {
  redisClientFollowers.zadd(userid, data, (err, ok) => {
    if (err) {
      //FIXME: ERROR LOGS
    }
  });
};

delFromRedisFollowingsList = (userid, otherUserId) => {
  redisClientFollowings.zrem(userid, otherUserId, (err, ok) => {
    if (err) {
      //FIXME: ERROR LOGS
    }
  });
};

delFromRedisFollowersList = (userid, otherUserId) => {
  redisClientFollowers.zrem(userid, otherUserId, (err, ok) => {
    if (err) {
      //FIXME: ERROR LOGS
    }
  });
};

module.exports = {
  addToRedisFollowingsList,
  delFromRedisFollowingsList,
  addToRedisFollowersList,
  delFromRedisFollowersList,
};
