const { Command } = require("commander");
const fs = require("fs/promises");
const path = require("path");

const configTemplatePath = path.join(
  __dirname,
  "../config/migration.template.js"
);
const userConfigPath = path.join(process.cwd(), "config/migration.js");

const setupCommand = new Command("setup")
  .description("Create migration config.")
  .action(async () => {
    try {
      // Ensure the config directory exists
      const configDir = path.dirname(userConfigPath);
      await fs.mkdir(configDir, { recursive: true });

      // Check if the user configuration file already exists
      try {
        await fs.access(userConfigPath);
        console.log("Configuration file already exists. Skipping copy.");
      } catch (err) {
        // File does not exist, so copy the template
        await fs.copyFile(configTemplatePath, userConfigPath);
        console.log("Configuration template copied to your project.");
      }
    } catch (error) {
      console.error("Error during post-install setup:", error);
    } finally {
      process.exit();
    }
  });

module.exports = setupCommand;
