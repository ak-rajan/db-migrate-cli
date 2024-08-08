const { Command } = require("commander");
const Migration = require("../migration");

const setupCommand = new Command("setup")
  .description("Setup migration table and procedures")
  .action(async () => {
    try {
      const migration = new Migration();
      await migration.setup();
    } catch (error) {
      console.error(`Error running setup: ${error.message}`);
    } finally {
      process.exit();
    }
  });

module.exports = setupCommand;
