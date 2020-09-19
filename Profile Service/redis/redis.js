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

const redis = Redis.createClient(process.env.REDIS_URL, {retry_strategy: retry_strategy});

redis.on("connect", () => console.log("Redis connection established."));
redis.on("error", (e) => console.log(e));

global.redisClient = redis;
