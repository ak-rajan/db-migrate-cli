-- Create the table if it does not exist
CREATE TABLE IF NOT EXISTS `db_migrations` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `migration` varchar(255) NOT NULL,
    `batch` int(11) NOT NULL,
    `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS `addMigration`;
DROP PROCEDURE IF EXISTS `deleteMigration`;
DROP PROCEDURE IF EXISTS `getLastBatchMigrations`;
DROP PROCEDURE IF EXISTS `getMigrations`;

-- Create stored procedures
CREATE PROCEDURE `addMigration`(
    IN `p_migration` VARCHAR(255),
    IN `p_batch` INT
)
BEGIN
    INSERT INTO db_migrations (`migration`, `batch`)
    VALUES (p_migration, p_batch);
END;

CREATE PROCEDURE `deleteMigration`(
    IN `p_node_migration_id` BIGINT(20)
)
BEGIN
    DELETE FROM db_migrations WHERE id = p_node_migration_id;
END;

CREATE PROCEDURE `getLastBatchMigrations`()
BEGIN
    DECLARE p_last_batch INT;

    -- Get the last batch number
    SELECT MAX(batch) INTO p_last_batch FROM db_migrations;

    -- Select migrations for the last batch
    SELECT id, migration, batch
    FROM db_migrations
    WHERE batch = p_last_batch
    ORDER BY id DESC;
END;

CREATE PROCEDURE `getMigrations`()
BEGIN
    SELECT id, migration, batch
    FROM db_migrations;
END;