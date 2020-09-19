const Redis = require("redis");

retry_strategy = (options) => {
  //FIXME: SEND THE ERROR LOGS
  if (options.error && options.error.code === "ECONNREFUSED") {
    return new Error("The server refused the connection");
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error("Retry time exhausted");
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};

// ===PROFILE SERVICE REDIS CONNECTION===
const redisProfile = Redis.createClient(process.env.PROFILE_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisProfile.on("connect", () =>
  console.log("PF Redis connection established.")
);
redisProfile.on("error", (e) => console.log(e));

// ===FOLLOW SERVICE REDIS CONNECTION=== **FOLLOWINGS
const redisFollowings = Redis.createClient(process.env.FOLLOWINGS_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisFollowings.on("connect", () =>
  console.log("FG Redis connection established.")
);
redisFollowings.on("error", (e) => console.log(e));

// ===POSTS SERVICE REDIS CONNECTION===
const redisPosts = Redis.createClient(process.env.POSTS_REDIS_URL, {
  retry_strategy: retry_strategy,
});
redisPosts.on("connect", () =>
  console.log("PST Redis connection established.")
);
redisPosts.on("error", (e) => console.log(e));

// ===FOLLOW SERVICE REDIS CONNECTION=== **FOLLOWERS
const redisFollowers = Redis.createClient(process.env.FOLLOWERS_REDIS_URL, {
  retry_strategy: retry_strategy,
});
redisFollowers.on("connect", () =>
  console.log("FL Redis connection established.")
);
redisFollowers.on("error", (e) => console.log(e));

// ===TIMELINE REDIS CONNECTION===
const redisTimeline = Redis.createClient(process.env.TIMELINE_REDIS_URL, {
  retry_strategy: retry_strategy,
});
redisTimeline.on("connect", () =>
  console.log("TMLN Redis connection established.")
);
redisTimeline.on("error", (e) => console.log(e));

// ===== REDIS NEWS FEED =====
const redisNewsFeed = Redis.createClient(process.env.NEWSFEED_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisNewsFeed.on("connect", () =>
  console.log("NF Redis connection established.")
);
redisNewsFeed.on("error", (e) => console.log(e));

// ===== POST LIKES REDIS ========

const redisLike = Redis.createClient(process.env.LIKE_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisLike.on("connect", () =>
  console.log("LIKE Redis connection established.")
);
redisLike.on("error", (e) => console.log(e));

global.redisClientProfile = redisProfile;
global.redisClientFollowings = redisFollowings;
global.redisClientFollowers = redisFollowers;
global.redisClientPosts = redisPosts;
global.redisClientTimeline = redisTimeline;
global.redisClientNewsFeed = redisNewsFeed;
global.redisClientLike = redisLike;
