const Redis = require("redis");

retry_strategy = (options) => {
  if (options.error && options.error.code === "ECONNREFUSED") {
    return new Error("The server refused the connection");
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    return new Error("Retry time exhausted");
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    //FIXME: SEND THE ERROR LOGS
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
};

//REDIS NEWS FEED
const redisNewsFeed = Redis.createClient(process.env.NEWSFEED_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisNewsFeed.on("connect", () =>
  console.log("NF Redis connection established.")
);
redisNewsFeed.on("error", (e) => console.log(e));

//REDIS FOLLOWERS
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

global.redisNewsFeedClient = redisNewsFeed;
global.redisFollowersClient = redisFollowers;
global.redisTimelineClient = redisTimeline;
