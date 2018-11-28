module.exports = {
  development: {
    client: "pg",
    connection: {
      filename: "postgres://localhost/hex_collections"
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
