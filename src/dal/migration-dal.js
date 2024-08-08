const Migration = require("../models/migration");
const BaseDAL = require("./base-dal");

class MigrationDAL extends BaseDAL {
  constructor() {
    super();
  }

  addMigration = async (migration, batch) => {
    try {
      const result = await this.executeStoredProcedure("addMigration", [
        migration,
        batch,
      ]);

      return true;
    } catch (err) {
      console.log(err);
    }

    return false;
  };

  deleteMigration = async (migrationId) => {
    try {
      const result = await this.executeStoredProcedure("deleteMigration", [
        migrationId,
      ]);

      return true;
    } catch (err) {
      console.log(err);
    }

    return false;
  };

  getMigrations = async () => {
    try {
      const result = await this.executeStoredProcedure("getMigrations");
      if (this.hasResponse(result)) {
        const migrations = result[0].map(({ id, migration, batch }) => {
          const migrationModel = new Migration();
          migrationModel.id = id;
          migrationModel.migration = migration;
          migrationModel.batch = batch;

          return migrationModel;
        });

        return migrations;
      }
    } catch (err) {
      console.log(err);
    }

    return [];
  };

  getLastBatchMigrations = async () => {
    try {
      const result = await this.executeStoredProcedure(
        "getLastBatchMigrations"
      );
      if (this.hasResponse(result)) {
        const migrations = result[0].map(({ id, migration, batch }) => {
          const migrationModel = new Migration();
          migrationModel.id = id;
          migrationModel.migration = migration;
          migrationModel.batch = batch;

          return migrationModel;
        });

        return migrations;
      }
    } catch (err) {
      console.log(err);
    }

    return [];
  };
}

module.exports = new MigrationDAL();
