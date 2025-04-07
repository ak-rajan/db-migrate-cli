# db-migrate-cli

[![npm](https://badgen.net/npm/v/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)
[![npm](https://badgen.net/npm/license/db-migrate-cli)](https://www.npmjs.com/package/db-migrate-cli)

**db-migrate-cli** is a command-line tool for managing database migrations with MySQL and MariaDB. It simplifies creating, applying, and rolling back database changes using SQL files.

## Tested With

- Node.js 20.10.0 or greater

## Prerequisites

- MySQL or MariaDB installed and running
- Node.js 20.10.0 or newer
- A database user with privileges to create tables, stored procedures, and execute SQL statements

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start](#quick-start)
  - [SQL-Based Migrations](#sql-based-migrations)
  - [Commands](#commands)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [License](#license)
- [Author](#author)

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

- 📝 Creates `database/config.js`.
- 🔧 Customize `migrationDir` and database settings in this file.

**Example:**

```bash
db-cli setup

# Output:
# Configuration file created at database/config.js
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
# Procedures 'db_cli_add_migration', 'db_cli_delete_migration', 'db_cli_get_last_batch_migrations', and 'db_cli_get_migrations' created.
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

# Output (Single SQL Statement in `-- UP`):
# Migrating: 2024_08_09_13_59_01_create_users_table.sql
# Migrated: 2024_08_09_13_59_01_create_users_table.sql

# Output (Multiple SQL Statements in `-- UP`)
# Migrating: 2025_04_04_06_16_45_create_common_crud_procedures.sql
# Statement 1/4 lines  4–20: CREATE PROCEDURE insert_record_into_table(
# Statement 2/4 lines 22–37: CREATE PROCEDURE update_table_record(
# Statement 3/4 lines 39–53: CREATE PROCEDURE delete_record_from_table(
# Statement 4/4 lines 55–71: CREATE PROCEDURE select_records_from_table(
# Migrated: 2025_04_04_06_16_45_create_common_crud_procedures.sql
```

#### **5. Rollback Changes**

```bash
db-cli rollback
```

- ⏪ Reverts the most recent batch of migrations.

**Example:**

```bash
db-cli rollback

# Output (Single SQL Statement in `-- DOWN`):
# Rolling back: 2024_08_09_13_59_01_create_users_table.sql
# Rolled back: 2024_08_09_13_59_01_create_users_table.sql

# Output (Multiple SQL Statements in `-- DOWN`):
# Rolling back: 2025_04_04_06_16_45_create_common_crud_procedures.sql
# Statement 1/4  line  77: DROP PROCEDURE IF EXISTS insert_record_into_table
# Statement 2/4  line  78: DROP PROCEDURE IF EXISTS update_table_record
# Statement 3/4  line  79: DROP PROCEDURE IF EXISTS delete_record_from_table
# Statement 4/4  line  80: DROP PROCEDURE IF EXISTS select_records_from_table
# Rolled back: 2025_04_04_06_16_45_create_common_crud_procedures.sql
```

**📁 Project Structure**

After setup and creating migrations, your project structure may look like:

```bash
project-root/
├──  database/
│  ├──  config.js  # Configuration file for DB connection and migration settings
│  ├──  migrations/  # Folder containing SQL migration files
│  │  └──  2024_08_09_13_59_01_create_users_table.sql  # Example migration file
```

### SQL-Based Migrations

**db-migrate-cli** uses SQL files for migrations, with `-- UP` for applying changes and `-- DOWN` for rolling back. This gives you full control over the SQL executed.

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

- **`-- UP`**: SQL commands to apply the changes (e.g., creating tables, adding columns).
- **`-- DOWN`**: SQL commands to reverse the changes (e.g., dropping tables, removing columns).

#### Advanced Features

- ✅ **Multiple statements** under `-- UP` and `-- DOWN` are supported.
- 🔄 Handles custom **delimiters** like `DELIMITER $$`, perfect for stored procedures and complex routines.
- 🧠 Smart parsing to preserve block contents inside `BEGIN ... END` or `CREATE PROCEDURE`.
- 🔢 Tracks executed statements by line number, enabling precise rollbacks.

**Example: Migration with Delimiters**

```sql
-- UP
DELIMITER $$

CREATE PROCEDURE sp_log_error(
    IN request_id INT,
    IN message TEXT
)
BEGIN
    INSERT INTO error_logs (request_id, message, created_at)
    VALUES (request_id, message, NOW());
END$$

DELIMITER ;

-- DOWN
DROP PROCEDURE IF EXISTS sp_log_error;
```

This ensures your stored routines are executed correctly without getting split or malformed during parsing.

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

Edit `database/config.js` after running `db-cli setup`:

```javascript
module.exports = {
  migrationDir: "database/migrations", // Directory where migration files are stored

  // Database connection settings
  db: {
    host: "localhost", // Database host
    user: "root", // Database user
    password: "password", // Database password
    database: "my_database", // Database name
    port: 3306, // (Optional) Default is 3306
  },
};
```

## Dependencies

- `chalk`: Used for styling terminal output.
- `commander`: Command-line argument parser.
- `fs.promises`: Promises API for interacting with the filesystem.
- `mysql2`: MySQL client for Node.js.
- `path`: Utility for handling and transforming file paths.

## License

MIT License

## Author

Developed by [Anjutech](https://www.anjutech.com) (<arunkumar@anjutech.com>).

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a pull request or issue on [GitHub](https://github.com/ak-rajan/db-migrate-cli).
