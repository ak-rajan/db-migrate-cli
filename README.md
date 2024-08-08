# db-migrate-cli
[![npm](https://badgen.net/npm/v/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)
[![npm](https://badgen.net/npm/license/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)


**db-migrate-cli** is a command-line interface tool designed for managing database migrations with MySQL and MariaDB. It simplifies the process of creating, applying, and rolling back database changes.

## Table of Contents
-   [Installation](#installation)
-   [Usage](#usage)
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
After running `db-cli setup`, edit the `config/migration.js` file to specify:

 -   `migrationDir`: Directory where migration files are stored.
 -    Database connection settings: Configure your database connection parameters.

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