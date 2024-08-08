#!/usr/bin/env node
const { program } = require("commander");
const fs = require("fs");
const path = require("path");

const commandsPath = path.resolve(__dirname, "../commands");
fs.readdirSync(commandsPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const command = require(path.join(commandsPath, file));
    program.addCommand(command);
  }
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
