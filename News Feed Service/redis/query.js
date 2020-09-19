const addToNewsFeedCache = (userid, data) =>
  new Promise((resolve, reject) => {
    redisNewsFeedClient.zadd(userid, data, (err, ok) => {
      if (err) {
        //FIXME: error logs
        reject(err);
      }
      if (ok) {
        resolve(true);
        redisNewsFeedClient.zcard(userid, (err, count) => {
          if (count > 100) {
            redisNewsFeedClient.zremrangebyrank(
              userid,
              100,
              count,
              (err, ok) => {
                if (err) {
                  //FIXME: error logs
                }
              }
            );
          }
        });
      }
    });
  });

const deleteFromNewsFeedCache = (userid, postids) => {
  return redisNewsFeedClient.zrem(userid, postids, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

const getFollowersFromCache = (userid, offset, end) => {
  return new Promise((resolve, reject) => {
    redisFollowersClient.zrange(userid, offset, end, (err, list) => {
      if (err || !list.length) resolve(false);
      else resolve(list);
    });
  });
};

const getFollowersCountFromCache = (userid) => {
  return new Promise((resolve, reject) => {
    redisFollowersClient.zcard(userid, (err, count) => {
      if (err) reject(err);
      else resolve(count);
    });
  });
};

const getPostsOfUser = (userid, offset = 0, limit = 20) => {
  return new Promise((resolve, reject) => {
    redisTimelineClient.zrevrange(
      userid,
      offset,
      limit,
      "withscores",
      (err, postids) => {
        if (err || postids === null) return reject(false);
        if (postids.length) {
          return resolve(postids);
        } else {
          return reject(false);
        }
      }
    );
  });
};

module.exports = {
  addToNewsFeedCache,
  deleteFromNewsFeedCache,
  getFollowersFromCache,
  getFollowersCountFromCache,
  getPostsOfUser,
};
