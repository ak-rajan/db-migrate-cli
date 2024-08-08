// index.js

const Migration = require("./src/migration");

// Exporting the Migration class for users to access programmatically
module.exports = {
  Migration,
};

// Optionally, you can provide some basic documentation or help
console.log(
  "Migration package loaded. Use the CLI commands or import the Migration class to manage migrations."
);
