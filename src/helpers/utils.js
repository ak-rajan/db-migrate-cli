const path = require("path");

const resolvePath = (relativePath) => {
  const rootDir = path.resolve(__dirname, "..");
  return path.resolve(rootDir, relativePath);
};

module.exports = { resolvePath };
