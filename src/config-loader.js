const path = require("path");

const loadConfig = (configPath) => {
  try {
    const fullPath = path.resolve(process.cwd(), configPath);
    return require(fullPath);
  } catch (error) {
    console.error(`Failed to load config from ${configPath}: ${error.message}`);
    process.exit(1);
  }
};

module.exports = loadConfig;
