"use strict";
import fs from "fs";
import path from "path";
import { ModelStatic, Sequelize } from "sequelize";
import { User } from "./users";
import { File } from "./files";

require("dotenv").config({
  path: path.resolve(__dirname, "../../../../.env"),
});

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config: any = {
  development: {
    username: process.env.SERVER_DB_USER!,
    password: process.env.SERVER_DB_PASSWORD!,
    database: process.env.SERVER_DB_NAME!,
    host: process.env.SERVER_DB_HOST!,
    dialect: process.env.SERVER_DIALECT!,
    schema: process.env.RSDE_DTT_SCHEMA!,
    seederStorage: "sequelize",
    seederStorageTableName: "sequelizeData",
    timezone: "+08:00",
    dialectOptions: {
      prependSearchPath: true,
    },
  },
  production: {
    username: process.env.SERVER_DB_USER!,
    password: process.env.SERVER_DB_PASSWORD!,
    database: process.env.SERVER_DB_NAME!,
    host: process.env.SERVER_DB_HOST!,
    dialect: process.env.SERVER_DIALECT!,
    schema: process.env.RSDE_DTT_SCHEMA!,
    seederStorage: "sequelize",
    seederStorageTableName: "sequelizeData",
    // required because we use CURRENT_DATE etc.
    timezone: "+08:00",
    dialectOptions: {
      prependSearchPath: true,
    },
  },
}[env];

export interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  users: ModelStatic<User>;
  files: ModelStatic<File>;
}

let sequelize: any;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db: any = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(sequelize);
    // enhance model with access control methods
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db as DB;
