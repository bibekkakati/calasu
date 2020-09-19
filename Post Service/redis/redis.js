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

const redisPosts = Redis.createClient(process.env.POSTS_REDIS_URL, {
  retry_strategy: retry_strategy,
});
const redisTimeline = Redis.createClient(process.env.TIMELINE_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisPosts.on("connect", () =>
  console.log("PST Redis connection established.")
);
redisPosts.on("error", (e) => console.log(e));

redisTimeline.on("connect", () =>
  console.log("TMLN Redis connection established.")
);
redisTimeline.on("error", (e) => console.log(e));

global.redisPostClient = redisPosts;
global.redisTimelineClient = redisTimeline;
