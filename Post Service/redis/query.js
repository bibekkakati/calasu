const addToPostMetaDataCache = (postid, data) => {
  return redisPostClient.hmset(postid, data, (err, ok) => {
    if (ok) redisPostClient.expire(postid, 100000);
  });
};

const updatePostMetaDataCache = (postid, data) => {
  return redisPostClient.exists(postid, (err, key) => {
    if (key) {
      addToPostMetaDataCache(postid, data);
    }
  });
};

const deleteFromPostMetaDataCache = (postid) => {
  return redisPostClient.del(postid, (err, ok) => {
    if (err) {
      //FIXME: send error logs
    }
  });
};

const incrby = (postid, field) => {
  return redisPostClient.hincrby(postid, field, 1, (err, reply) => {
    if (err) {
      redisPostClient.del(postid, (err, ok) => {
        if (err) {
          //FIXME: send to error logs
        }
      });
    }
  });
};

const decrby = (postid, field) => {
  return redisPostClient.hincrby(postid, field, -1, (err, reply) => {
    if (err) {
      redisPostClient.del(postid, (err, ok) => {
        if (err) {
          //FIXME: send to error logs
        }
      });
    }
  });
};

const addToPersonalTimeline = (userid, data) => {
  return redisTimelineClient.zadd(userid, data, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

const delFromPersonalTimeline = (userid, postid) => {
  return redisTimelineClient.zrem(userid, postid, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

module.exports = {
  addToPostMetaDataCache,
  updatePostMetaDataCache,
  deleteFromPostMetaDataCache,
  addToPersonalTimeline,
  delFromPersonalTimeline,
  incrby,
  decrby,
};
