// This is only for sequelize-cli. See models/index.ts for sequelize config used by server.

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../../.env"),
});

const loadConfig = async () => {
  try {
    const module = await import("@wotm/env/load-env.ts");
    await module.loadEnvs(RSDE_DTT_SM_ENV_SECRET);
  } catch (error) {
    console.error("Unable to load envs from Secret Manager.");
  }

  return {
    development: {
      username: process.env.SERVER_DB_USER,
      password: process.env.SERVER_DB_PASSWORD,
      database: process.env.SERVER_DB_NAME,
      host: process.env.SERVER_DB_HOST,
      dialect: process.env.SERVER_DIALECT || "postgres",
      seederStorage: "sequelize",
      seederStorageTableName: "sequelizeData",
      schema: process.env.RSDE_DTT_SCHEMA,
      timezone: "+08:00",
      dialectOptions: {
        prependSearchPath: true,
      },
    },
    production: {
      username: process.env.SERVER_DB_USER,
      password: process.env.SERVER_DB_PASSWORD,
      database: process.env.SERVER_DB_NAME,
      host: process.env.SERVER_DB_HOST,
      dialect: process.env.SERVER_DIALECT || "postgres",
      seederStorage: "sequelize",
      seederStorageTableName: "sequelizeData",
      schema: process.env.RSDE_DTT_SCHEMA,
      // required because we use CURRENT_DATE etc.
      timezone: "+08:00",
      dialectOptions: {
        prependSearchPath: true,
      },
    },
  };
};

module.exports = loadConfig();
