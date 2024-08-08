const { Command } = require("commander");
const Migration = require("../migration");

const runMigrate = new Command("migrate")
  .description("Execute migration files")
  .action(async () => {
    const chalk = (await import("chalk")).default;
    const migration = new Migration();
    try {
      await migration.runMigrations();
    } catch (error) {
      console.error(`Error doing migrate: ${error.message}`);
    } finally {
      process.exit();
    }
  });

module.exports = runMigrate;
