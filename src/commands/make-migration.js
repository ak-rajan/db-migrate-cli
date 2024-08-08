const { Command } = require("commander");
const fs = require("fs/promises");
const Migration = require("../migration");

const makeMigrationCommand = new Command("make:migration")
  .description("Create a new migration file")
  .argument("<name>", "Migration name")
  .action(async (name) => {
    const migration = new Migration();
    try {
      await migration.createMigrationFile(name);
    } catch (error) {
      console.error(`Error creating migration file: ${error.message}`);
    } finally {
      process.exit();
    }
  });

module.exports = makeMigrationCommand;
