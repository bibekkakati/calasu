addToPostLikes = (postid, data) => {
  return redisLikeClient.zadd(postid, data, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

deletePostLike = (postid, userid) => {
  return redisLikeClient.zrem(postid, userid, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

deletePostLikes = (postid) => {
  return redisLikeClient.del(postid, (err, ok) => {
    if (err) {
      //FIXME: error logs
    }
  });
};

module.exports = {
  addToPostLikes,
  deletePostLike,
  deletePostLikes,
};
