require('dotenv').config();

module.exports = {
  development: {
    client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION,
    migrations: {
      directory: process.env.DB_MIGRATION_DIR,
    },
    seeds: {
      directory: process.env.DB_SEEDS_DIR
    },
    useNullAsDefault: true
  },

  production: {
    client: process.env.DB_CLIENT,
    connection: process.env.DB_CONNECTION,
    migrations: {
      directory: process.env.DB_MIGRATION_DIR,
    },
    seeds: {
      directory: process.env.DB_SEEDS_DIR
    },
    useNullAsDefault: true
  }
};