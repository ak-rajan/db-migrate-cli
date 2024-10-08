const { Command } = require("commander");
const Migration = require("../migration");

const runRollback = new Command("rollback")
  .description("Rollback migration files")
  .action(async () => {
    const migration = new Migration();
    try {
      await migration.rollbackMigrations();
    } catch (error) {
      console.error(`Error in rollback migration: ${error.message}`);
    } finally {
      process.exit();
    }
  });

module.exports = runRollback;
