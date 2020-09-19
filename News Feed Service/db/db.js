const cassandra = require("cassandra-driver");
// const client = new cassandra.Client({
// contactPoints: [process.env.DB_HOST],
// localDataCenter: "aiven",
// authProvider: new cassandra.auth.PlainTextAuthProvider(
//   process.env.DB_USER,
//   process.env.DB_PASS
// ),
// });

var client;

const dbConnect = async () => {
  client = new cassandra.Client({
    cloud: {
      secureConnectBundle: __dirname + "/secure-connect-calasu.zip",
    },
    credentials: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
  });
  try {
    client
      .connect()
      .then(async () => {
        var q =
          "CREATE KEYSPACE IF NOT EXISTS news_feed WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}";
        // await client.execute(q);
        q =
          "CREATE TABLE IF NOT EXISTS news_feed.nf(userid text, timestamp bigint, postid text, postedby text, PRIMARY KEY ((userid), timestamp, postid)) WITH CLUSTERING ORDER BY (timestamp DESC, postid DESC)";
        await client.execute(q);
        console.log("Cassandra connected.");
      })
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log(`Cassandra connection failed. ${error}`);
  }
};

module.exports = {
  dbConnect,
  getClient: () => client,
};
