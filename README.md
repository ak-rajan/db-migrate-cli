# db-migrate-cli
[![npm](https://badgen.net/npm/v/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)
[![npm](https://badgen.net/npm/license/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)


**db-migrate-cli** is a command-line interface tool designed for managing database migrations with MySQL and MariaDB. It simplifies the process of creating, applying, and rolling back database changes.

## Table of Contents
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Quick Start](#quick-start)
    -   [Commands](#commands)
        -   [setup](#setup)
        -   [migrate:init](#migrateinit)
        -   [make:migration](#makemigration)
        -   [migrate](#migrate)
        -   [rollback](#rollback)
-   [Configuration](#configuration)
-   [Dependencies](#dependencies)
-   [License](#license)
-   [Author](#author)
## Installation
To install the tool globally, use npm:

```bash
npm  install  -g  db-migrate-cli
```
This will make the `db-cli` command available globally on your system, allowing you to run migration commands from anywhere.

## Usage
### <a id="quick-start"></a> 🚀 Quick Start
Get up and running with `db-migrate-cli` in just a few simple steps! Here's how you can manage your database migrations like a pro.
#### **1. Setup Your Migration Configuration**
Kickstart your migration process by setting up the configuration file.
```bash
db-cli setup
```
 - 📝 This creates the `config/migration.js` file in your project.
 - 🔧 Customize the `migrationDir` and your database settings in this file.
#### **2. Initialize Migration Infrastructure**
Prepare your database for migrations by setting up the necessary tables and procedures.
```bash
db-cli migrate:init
```
-   🚀 This creates a `db_migrations` table in your configured database.
-   ⚙️ Also sets up essential stored procedures to manage your migrations.
#### **3. Create Your First Migration**
Ready to make some changes? Create a new migration file with your desired changes.
```bash
db-cli make:migration <migration_name>
```
-   📁 The file is stored in the directory specified by `migrationDir`.
-   ⏰ The file name includes a timestamp and is in snake case.
#### **4. Apply Migrations**
Time to execute your changes! Run all pending migrations to update your database.
```bash
db-cli migrate
```
- ✅ This applies all the migrations that haven't been executed yet.
#### **5. Rollback Changes**
Made a mistake? No problem! Rollback the last batch of changes.
```bash
db-cli rollback
```
- ⏪ This undoes the last set of migrations applied.
### Commands
#### `setup`
Initializes the migration configuration by creating the `config/migration.js` file in the current working directory. Configure the `migrationDir` and database settings in this file after running the command.
```bash
db-cli  setup
```
#### `migrate:init`
Sets up the migration infrastructure by creating the `db_migrations` table in your configured database and establishing the necessary stored procedures.
```bash
db-cli  migrate:init
```
#### `make:migration`
Generates a new migration file within the `migrationDir` specified in `config/migration.js`. The file name includes a timestamp and the provided name, converted to snake case.
```bash
db-cli  make:migration <migration_name>
```
#### `migrate`
Executes all pending migrations, applying them to the configured database.
```bash
db-cli  migrate
```
#### `rollback`
Reverts the most recent batch of migrations, undoing the last changes applied.
```bash
db-cli  rollback
```

## Configuration

After running `db-cli setup`, you will have a `config/migration.js` file in your project. You'll need to edit this file to specify your migration directory and database connection settings. Here's how:
```json
module.exports = {
  migrationDir: 'migrations',  // Directory where migration files are stored

  // Database connection settings
  db: {
    host: 'localhost',         // Database host
    user: 'root',              // Database user
    password: 'password',      // Database password
    database: 'my_database',   // Database name
    port: 3306                 // (Optional) Default is 3306
  }
};
```
### Configuration Options:

-   **`migrationDir`**: The directory where your migration files will be stored. This is where new migration files created with `db-cli make:migration` will be saved.
    
-   **`db` Object**: Contains your database connection settings:
    
    -   **`host`**: The hostname of your database server.
    -   **`user`**: The username used to connect to the database.
    -   **`password`**: The password associated with the database user.
    -   **`database`**: The name of the database where migrations will be applied.
    -   **`port`**: (Optional) The port on which your database server is listening. Defaults to `3306` for MySQL/MariaDB.

## Dependencies

-  `chalk`: Used for styling terminal output.
-  `commander`: Command-line argument parser.
-  `fs.promises`: Promises API for interacting with the filesystem.
-  `mysql2`: MySQL client for Node.js.
-  `path`: Utility for handling and transforming file paths.

## License

This project is licensed under the MIT License.

## Author

Developed by [Anjutech](https://www.anjutech.com) (<arunkumar@anjutech.com>).