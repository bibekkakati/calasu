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

const redisFollowings = Redis.createClient(process.env.FOLLOWINGS_REDIS_URL, {
  retry_strategy: retry_strategy,
});
const redisFollowers = Redis.createClient(process.env.FOLLOWERS_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisFollowings.on("connect", () =>
  console.log("FG Redis connection established.")
);
redisFollowings.on("error", (e) => console.log(e));

redisFollowers.on("connect", () =>
  console.log("FL Redis connection established.")
);
redisFollowers.on("error", (e) => console.log(e));

global.redisClientFollowings = redisFollowings;
global.redisClientFollowers = redisFollowers;
