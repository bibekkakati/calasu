require("dotenv").config();

const app = require("express")();
const bodyparser = require("body-parser");

// REDIS CONNECTION
require("./redis/redis");

const verifyToken = require("./middlewares/verifyToken");

//Middleware for body-parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// BRING ROUTES
const authService = require("./controllers/routes/authService");
const profileService = require("./controllers/routes/profileService");
const followService = require("./controllers/routes/followService");
const postService = require("./controllers/routes/postService");
const newsFeedService = require("./controllers/routes/newsFeedService");
const likeService = require("./controllers/routes/likeService");

app.get("/", (req, res) => {
  res.send("API gateway running..!!");
});

// ACTUAL ROUTES
const commonRoute = "/api/" + process.env.API_VERSION;
app.use(`${commonRoute}/auth`, authService);
app.use(verifyToken);
app.use(`${commonRoute}/profile`, profileService);
app.use(`${commonRoute}/profile`, followService);
app.use(`${commonRoute}/post`, postService);
app.use(`${commonRoute}/feed`, newsFeedService);
app.use(`${commonRoute}/post`, likeService);

app.get("*", (req, res) => {
  res.status(404).send("Invalid URL");
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log("API Gateway running at http://localhost:" + PORT)
);

handleExit = async (signal) => {
  console.log(`Received ${signal}. Close my server properly.`);
  await redisClientProfile.quit();
  await redisClientFollowings.quit();
  await redisClientFollowers.quit();
  await redisClientPosts.quit();
  await redisClientNewsFeed.quit();
  await redisClientLike.quit();
  server.close(() => {
    process.exit(0);
  });
};
process.on("SIGINT", handleExit);
process.on("SIGQUIT", handleExit);
process.on("SIGTERM", handleExit);
