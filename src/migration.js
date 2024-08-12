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
    const config = loadConfig("config/migration.js");
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

  // Run a single migration file
  async runMigration(file, batch) {
    const chalk = (await import("chalk")).default;
    console.log(chalk.blue("Migrating: ") + file);

    const filePath = path.join(this.migrationsDir, file);
    const content = await fs.readFile(filePath, "utf8");
    const [upSql] = content.split("-- DOWN").map((part) => part.trim());

    await this.executeSql(upSql);
    await migrationDal.addMigration(file.replace(".sql", ""), batch);
    console.log(chalk.green("Migrated: ") + file);
  }

  // Rollback a single migration
  async rollbackMigration(migration) {
    const chalk = (await import("chalk")).default;

    const file = `${migration.migration}.sql`;
    const filePath = path.join(this.migrationsDir, file);
    try {
      await fs.access(filePath);
    } catch (err) {
      console.error(chalk.red(`Migration file not found: ${file}`));
      return;
    }

    const content = await fs.readFile(filePath, "utf8");
    const [, downSql] = content.split("-- DOWN").map((part) => part.trim());

    if (downSql) {
      await this.executeSql(downSql);
      await migrationDal.deleteMigration(migration.id);
      console.log(chalk.blue("Rollback: ") + file);
    } else {
      throw new Error(`No DOWN part found for migration ${file}`);
    }
  }

  // Run all pending migrations
  async runMigrations() {
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
        console.error("Error applying migration:", err);
        break;
      }
    }
  }

  // Rollback all migrations from the last batch
  async rollbackMigrations() {
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
        console.error("Error rolling back migration:", err);
        break;
      }
    }
  }

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
}

module.exports = Migration;
