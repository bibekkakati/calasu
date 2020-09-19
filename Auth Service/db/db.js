const { Pool } = require("pg");
const db_config = {
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 20,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
};
const pool = new Pool(db_config);
pool.on("error", (err, client) => {
  //FIXME: error logs
});

module.exports = {
  getPool: () => {
    return pool;
  },
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};
