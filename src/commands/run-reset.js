const { Command } = require("commander");
const Migration = require("../migration");

const runReset = new Command("reset")
  .description("Reset all applied migrations in reverse order")
  .action(async () => {
    const migration = new Migration();
    try {
      await migration.resetMigrations();
    } catch (error) {
      console.error(`Error in reset migration: ${error.message}`);
    } finally {
      process.exit();
    }
  });

module.exports = runReset;
