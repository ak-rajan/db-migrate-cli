const path = require("path");
const fs = require("fs");

const loadConfig = (configPath) => {
  try {
    let fullPath = path.resolve(process.cwd(), configPath);

    if (!fs.existsSync(fullPath)) {
      console.warn(
        `Config file not found at ${configPath}. Falling back to default template.`
      );
      fullPath = path.resolve(__dirname, "./config/migration.template.js");
    }

    return require(fullPath);
  } catch (error) {
    console.error(`Failed to load config from ${configPath}: ${error.message}`);
    process.exit(1);
  }
};

module.exports = loadConfig;
