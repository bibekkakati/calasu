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

const redisLike = Redis.createClient(process.env.LIKE_REDIS_URL, {
  retry_strategy: retry_strategy,
});

redisLike.on("connect", () =>
  console.log("LIKE Redis connection established.")
);
redisLike.on("error", (e) => console.log(e));

global.redisLikeClient = redisLike;
