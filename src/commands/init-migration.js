const { Command } = require("commander");
const fs = require("fs/promises");
const path = require("path");
const Migration = require("../migration");

const initializeMigration = new Command("migrate:init")
  .description("Create migration table and procedures.")
  .action(async () => {
    try {
      const migration = new Migration();
      await migration.init();
    } catch (error) {
      console.error("Error initializing migration:", error);
    } finally {
      process.exit();
    }
  });

module.exports = initializeMigration;
