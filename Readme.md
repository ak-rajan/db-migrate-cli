# db-migrate-cli

[![npm](https://badgen.net/npm/v/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)
[![npm](https://badgen.net/npm/license/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)

**db-migrate-cli** is a command-line tool for managing database migrations with MySQL and MariaDB. It simplifies creating, applying, and rolling back database changes using SQL files.

## Tested With

- Node.js 20.10.0 or greater

## Table of Contents
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Quick Start](#quick-start)
    -   [SQL-Based Migrations](#sql-based-migrations)
    -   [Commands](#commands)
-   [Configuration](#configuration)
-   [Dependencies](#dependencies)
-   [License](#license)
-   [Author](#author)

## Installation
Install globally via npm:

```bash
npm install -g db-migrate-cli
```
This makes the `db-cli` command available system-wide.

## Usage

### <a id="quick-start"></a> 🚀 Quick Start
Get up and running with `db-migrate-cli` in just a few simple steps! Here's how you can manage your database migrations like a pro.

#### **1. Setup Your Migration Configuration**
```bash
db-cli setup
```

- 📝 Creates `config/migration.js`.
- 🔧 Customize `migrationDir` and database settings in this file.

**Example:**
```bash
db-cli setup

# Output:
# Configuration file created at config/migration.js
```
#### **2. Initialize Migration Infrastructure**
```bash
db-cli migrate:init
```

- ⚙️ Creates `db_migrations` table and necessary stored procedures in your database.

**Example:**
```bash
db-cli migrate:init

# Output:
# Migration infrastructure initialized. 'db_migrations' table created.
# Procedures 'addMigration', 'deleteMigration', 'getLastBatchMigrations', and 'getMigrations' created.
```

#### **3. Create Your First Migration**
```bash
db-cli make:migration <migration_name>
```

- 📁 Creates a migration file in `migrationDir` with a timestamp and name in snake case.

**Example:**
```bash
db-cli make:migration create_users_table

# Output:
# Migration file created: 2024_08_09_13_59_01_create_users_table.sql
```
#### **4. Apply Migrations**
```bash
db-cli migrate
```

- ✅ Executes all pending migrations.

**Example:**
```bash
db-cli migrate

# Output:
# Migrating: 2024_08_09_13_59_01_create_users_table.sql
# Migrated: 2024_08_09_13_59_01_create_users_table.sql
```
#### **5. Rollback Changes**
```bash
db-cli rollback
```

- ⏪ Reverts the most recent batch of migrations.

**Example:**
```bash
db-cli rollback

# Output:
# Rollback: 2024_08_09_13_59_01_create_users_table.sql
```
### SQL-Based Migrations

**db-migrate-cli** uses SQL files for migrations, with UP for applying changes and DOWN for rolling back. This gives you full control over the SQL executed. 

**Anatomy of a Migration File:**
```sql
-- migrations/2024_08_09_13_59_01_create_users_table.sql

-- UP
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT
);

-- DOWN
DROP TABLE users;
```

Each migration file is written in SQL and includes two sections:

- **UP**: Contains the SQL commands that apply the changes (e.g., creating tables, adding columns).
- **DOWN**: Contains the SQL commands that reverse the changes (e.g., dropping tables, removing columns).

This approach gives you precise control over the SQL executed during migration and rollback processes. By using raw SQL for migrations, you directly manage your database schema changes without abstraction layers.

### Commands
- `setup`: Initializes migration configuration.
```bash
db-cli setup
```
- `migrate:init`: Sets up migration infrastructure in the database.
```bash
db-cli migrate:init
```
- `make:migration <migration_name>`: Creates a new migration file.
```bash
db-cli make:migration <migration_name>
```
- `migrate`: Applies all pending migrations.
```bash
db-cli migrate
```
- `rollback`: Reverts the most recent migrations.
```bash
db-cli rollback
```

## Configuration
Edit `config/migration.js` after running `db-cli setup`:
```javascript
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
## Dependencies

-  `chalk`: Used for styling terminal output.
-  `commander`: Command-line argument parser.
-  `fs.promises`: Promises API for interacting with the filesystem.
-  `mysql2`: MySQL client for Node.js.
-  `path`: Utility for handling and transforming file paths.

## License

MIT License

## Author

Developed by [Anjutech](https://www.anjutech.com) (<arunkumar@anjutech.com>).