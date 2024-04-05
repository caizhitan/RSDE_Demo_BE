import { QueryInterface, Sequelize } from "sequelize";
import { DB } from "../sqlz-cli/models";
import { Umzug, SequelizeStorage } from "umzug";

/**
 * Run migrations or seeds programmatically.
 */
export class MigrationRunner {
  sequelize: Sequelize;
  migrator: Umzug<QueryInterface>;
  seeder: Umzug<QueryInterface>;
  db: DB;

  constructor(db: DB) {
    this.sequelize = db.sequelize;
    this.db = db;

    this.migrator = new Umzug({
      migrations: {
        glob: ["../sqlz-cli/migrations/*.{js,ts}", { cwd: __dirname }],
        resolve: ({ name, path, context }) => {
          const migration = require(path || "");
          return {
            name,
            up: async () => await migration.up(context, Sequelize),
            down: async () => await migration.down(context, Sequelize),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
        modelName: "SequelizeMeta",
        schema: process.env.RSDE_DTT_SCHEMA,
      }),
      logger: console,
    });

    this.seeder = new Umzug({
      migrations: {
        glob: ["../sqlz-cli/seeders/*.{js,ts}", { cwd: __dirname }],
        resolve: ({ name, path, context }) => {
          const migration = require(path || "");
          return {
            name,
            up: async () => migration.up(context, Sequelize),
            down: async () => migration.down(context, Sequelize),
          };
        },
      },
      context: this.sequelize.getQueryInterface(),
      storage: new SequelizeStorage({
        sequelize: db.sequelize,
        modelName: "sequelizeData",
        schema: process.env.RSDE_DTT_SCHEMA,
      }),
      logger: console,
    });
  }

  /**
   * Undo and redo all seed files
   * Reject if not in test and development mode
   */
  public async resetSeeds() {
    try {
      if (
        process.env.IS_TESTING !== "true" ||
        process.env.BUILD !== "development" ||
        process.env.NODE_ENV !== "development" ||
        process.env.SERVER_DB_HOST !== "localhost"
      )
        throw new Error("Must be in test and development mode to reset seeds!");
      await this.seeder.down({ to: 0 });
      await this.seeder.up();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Undo and redo all migration and seed files
   * Reject if not in test and development mode
   */
  public async resetMigrationAndSeeds() {
    try {
      if (
        process.env.IS_TESTING !== "true" ||
        process.env.BUILD !== "development" ||
        process.env.NODE_ENV !== "development" ||
        process.env.SERVER_DB_HOST !== "localhost"
      )
        throw new Error("Must be in test and development mode to reset seeds!");
      await this.seeder.down({ to: 0 });
      await this.migrator.down({ to: 0 });
      await this.migrator.up();
      await this.seeder.up();
    } catch (error) {
      console.log(error);
    }
  }

  public async clearDB() {
    try {
      if (
        process.env.IS_TESTING !== "true" ||
        process.env.BUILD !== "development" ||
        process.env.NODE_ENV !== "development" ||
        process.env.SERVER_DB_HOST !== "localhost"
      )
        throw new Error("Must be in test and development mode to reset seeds!");

      const models = Object.keys(this.db);

      for (const model of models) {
        if (model !== "sequelize" && model !== "Sequelize")
          await this.db[model].truncate({ cascade: true });
        continue;
      }

      await this.seeder.down({ to: 0 });
      await this.seeder.up();
    } catch (error) {
      console.log(error);
    }
  }
}
