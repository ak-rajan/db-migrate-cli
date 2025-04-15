const fs = require("fs/promises");
const path = require("path");
const migrationDal = require("./dal/migration-dal");
const coreDal = require("./dal/core-dal");
const mysql = require("mysql2/promise");
const loadConfig = require("./config-loader");
const sqlFilePath = path.join(__dirname, "./sql/setup.sql");
const database = require("./database");

class Migration {
  constructor() {
    const config = loadConfig("database/config.js");
    this.migrationsDir = path.join(process.cwd(), config.migrationsDir);
    this.database = config.database;
  }

  init = async () => {
    let connection;
    const chalk = (await import("chalk")).default;
    try {
      const sqlContent = await fs.readFile(sqlFilePath, "utf8");

      connection = await mysql.createConnection({
        host: this.database.host,
        user: this.database.user,
        password: this.database.password,
        database: this.database.database,
        multipleStatements: true,
      });

      await connection.query(sqlContent);
      console.log(chalk.green("Migration initializated successfully."));
    } catch (err) {
      console.error(chalk.red(`Error initializing migration: ${err.message}`));
    } finally {
      await connection.end();
      process.exit();
    }
  };

  // Get migration files sorted by name
  getMigrationFiles = async () => {
    const files = await fs.readdir(this.migrationsDir);
    return files.filter((file) => file.endsWith(".sql")).sort();
  };

  // Execute SQL and handle errors
  executeSql = async (sql) => {
    const status = await coreDal.executeQuery(sql);
    if (status !== "Success") {
      const chalk = (await import("chalk")).default;
      console.error(chalk.red(status));
      process.exit(1);
    }
  };

  processStatements = async (statements, chalk) => {
    const totalDigits = statements.length.toString().length;
    const shouldLog = statements.length > 1;

    for (let i = 0; i < statements.length; i++) {
      const { sql, startLine, endLine } = statements[i];

      if (shouldLog) {
        const firstLine = sql.trim().split(/\r?\n/)[0] || "";
        const preview =
          firstLine.length > 80
            ? firstLine.substring(0, 80).replace(/\s+/g, " ") + "..."
            : firstLine.replace(/\s+/g, " ");

        const rangeText =
          startLine === endLine
            ? `line  ${startLine.toString().padStart(2)}`
            : `lines ${startLine.toString().padStart(2)}-${endLine
                .toString()
                .padStart(2)}`;

        const statementIndex = `${(i + 1).toString().padStart(totalDigits)}/${
          statements.length
        }`;

        console.log(
          chalk.cyan(`Statement ${statementIndex}`) +
            chalk.dim(` ${rangeText}: `) +
            chalk.gray(preview)
        );
      }

      await this.executeSql(sql);
    }
  };

  runMigration = async (file, batch) => {
    const chalk = (await import("chalk")).default;
    console.log(chalk.bold.blueBright("Migrating: ") + chalk.whiteBright(file));

    const filePath = path.join(this.migrationsDir, file);
    const content = await fs.readFile(filePath, "utf8");
    const { sql: upSql, startLine: upStartLine } = this.parseUpBlock(content);

    const statements = this.splitSqlStatements(upSql, upStartLine - 1);
    if (statements.length > 0) {
      await this.processStatements(statements, chalk);
    }

    await migrationDal.addMigration(file.replace(".sql", ""), batch);
    console.log(chalk.bold.greenBright("Migrated: ") + chalk.whiteBright(file));
  };

  rollbackMigration = async (migration) => {
    const chalk = (await import("chalk")).default;
    const file = `${migration.migration}.sql`;
    const filePath = path.join(this.migrationsDir, file);
    console.log(
      chalk.bold.blueBright("Rolling back: ") + chalk.whiteBright(file)
    );

    try {
      await fs.access(filePath);
    } catch (err) {
      throw new Error(`Migration file not found: ${file}`);
    }

    const content = await fs.readFile(filePath, "utf8");
    const { sql: downSql, startLine: downStartLine } =
      this.parseDownBlock(content);

    const statements = this.splitSqlStatements(downSql, downStartLine - 1);
    if (statements.length === 0) {
      throw new Error(`No valid SQL found in DOWN for migration ${file}`);
    }

    await this.processStatements(statements, chalk);
    await migrationDal.deleteMigration(migration.id);
    console.log(
      chalk.bold.greenBright("Rolled back: ") + chalk.whiteBright(file)
    );
  };

  // Run all pending migrations
  runMigrations = async () => {
    const migrations = await migrationDal.getMigrations();
    const migratedFiles = migrations.map(
      (migration) => `${migration.migration}.sql`
    );
    const migrationFiles = await this.getMigrationFiles();

    const pendingFiles = migrationFiles.filter(
      (file) => !migratedFiles.includes(file)
    );

    if (pendingFiles.length === 0) {
      const chalk = (await import("chalk")).default;
      console.log(chalk.red("No new migrations to apply."));
      return;
    }

    const maxBatch =
      migrations.length > 0 ? migrations[migrations.length - 1].batch : 0;
    const newBatch = maxBatch + 1;

    for (const file of pendingFiles) {
      try {
        await this.runMigration(file, newBatch);
      } catch (err) {
        console.error("Error applying migration:", err.message);
        break;
      }
    }
  };

  // Rollback all migrations from the last batch
  rollbackMigrations = async () => {
    const chalk = (await import("chalk")).default;
    const migrations = await migrationDal.getLastBatchMigrations();

    if (migrations.length === 0) {
      console.log(chalk.red("No migrations to rollback."));
      return;
    }

    for (const migration of migrations) {
      try {
        await this.rollbackMigration(migration);
      } catch (err) {
        console.error(chalk.red(`${err.message}`));
        break;
      }
    }
  };

  // Rollback all applied migrations in reverse order
  resetMigrations = async () => {
    const chalk = (await import("chalk")).default;
    const allMigrations = await migrationDal.getMigrations();

    if (allMigrations.length === 0) {
      console.log(chalk.yellow("No migrations found to reset."));
      return;
    }

    // Rollback in reverse order (latest applied first)
    for (let i = allMigrations.length - 1; i >= 0; i--) {
      const migration = allMigrations[i];
      try {
        await this.rollbackMigration(migration);
      } catch (err) {
        console.error(
          chalk.red(`Error rolling back ${migration.migration}:`),
          err.message
        );
        break;
      }
    }

    console.log(chalk.green("All migrations have been reset."));
  };

  // Create a new migration file
  createMigrationFile = async (name) => {
    const chalk = (await import("chalk")).default;
    const now = new Date();
    const timestamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("_");

    const trimmedName = name.trim().toLowerCase();
    const formattedName = trimmedName.replace(/\s+/g, "_");
    const fileName = `${timestamp}_${formattedName}.sql`;

    await fs.mkdir(this.migrationsDir, { recursive: true });
    const filePath = path.join(this.migrationsDir, fileName);

    const baseName = `${formattedName}.sql`;
    const existingFiles = await fs.readdir(this.migrationsDir);

    const fileExists = existingFiles.some((file) => {
      const fileBaseName = file.replace(/^\d+_\d+_\d+_\d+_\d+_\d+_/, "");
      return fileBaseName === baseName;
    });

    if (fileExists) {
      console.error(chalk.red(`Migration file already exists: ${baseName}`));
      return;
    }

    const content = `
-- UP
-- Add your "up" migration SQL here

-- DOWN
-- Add your "down" migration SQL here
`;

    await fs.writeFile(filePath, content.trim());
    console.log(chalk.green(`Migration file created: ${fileName}`));
  };

  parseUpBlock = (content) => {
    const lines = content.split(/\r?\n/);
    const upIndex = lines.findIndex((line) => line.trim() === "-- UP");

    if (upIndex === -1) {
      throw new Error("Missing '-- UP' section.");
    }

    const downIndex = lines.findIndex(
      (line, i) => line.trim() === "-- DOWN" && i > upIndex
    );

    const upLines =
      downIndex !== -1
        ? lines.slice(upIndex + 1, downIndex)
        : lines.slice(upIndex + 1);

    return {
      sql: upLines.join("\n").trim(),
      startLine: upIndex + 2,
    };
  };

  parseDownBlock = (content) => {
    const lines = content.split(/\r?\n/);
    const downIndex = lines.findIndex((line) => line.trim() === "-- DOWN");

    if (downIndex === -1) {
      throw new Error("Missing '-- DOWN' section.");
    }

    const upIndex = lines.findIndex(
      (line, i) => line.trim() === "-- UP" && i > downIndex
    );

    const downLines =
      upIndex !== -1
        ? lines.slice(downIndex + 1, upIndex)
        : lines.slice(downIndex + 1);

    return {
      sql: downLines.join("\n").trim(),
      startLine: downIndex + 2,
    };
  };

  splitSqlStatements = (content, startLineOffset = 0) => {
    const lines = content.split(/\r?\n/);
    const statements = [];
    let current = [];
    let currentStartLine = 0;
    let delimiter = ";";

    const delimiterRegex = /^DELIMITER\s+(.+)$/i;

    for (let i = 0; i < lines.length; i++) {
      const actualLine = lines[i];
      const line = actualLine.trim();

      const match = line.match(delimiterRegex);
      if (match) {
        delimiter = match[1];
        continue;
      }

      if (current.length === 0 && line === "") {
        continue; // skip blank lines between statements
      }

      if (current.length === 0) {
        currentStartLine = i; // first non-blank line in this statement
      }

      current.push(actualLine);

      if (line.endsWith(delimiter)) {
        const sql = current.join("\n").trim();

        if (sql) {
          statements.push({
            sql: sql.slice(0, -delimiter.length).trim(), // remove delimiter
            startLine: currentStartLine + 1 + startLineOffset,
            endLine: i + 1 + startLineOffset,
          });
        }

        current = [];
        currentStartLine = i + 1;
      } else if (current.length === 1) {
        currentStartLine = i;
      }
    }

    return statements;
  };
}

module.exports = Migration;
