module.exports = {
  development: {
    client: "pg",
    connection: {
      filename: "postgres://localhost/pixel-picker"
    },
    migrations: {
      directory: "./db/migrations"
    },
    seeds: {
      directory: "./db/seeds/dev"
    },
    useNullAsDefault: true
  }
};
