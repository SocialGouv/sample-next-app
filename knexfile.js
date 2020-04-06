const databaseName = "postgres";

const connection_url =
  process.env.DATABASE_URL ||
  `postgres://postgres:@localhost:5434/${databaseName}`;

module.exports = {
  client: "pg",
  connection: connection_url,
  migrations: {
    directory: __dirname + "/db/migrations"
  }
};
