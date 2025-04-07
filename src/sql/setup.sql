-- Create the table if it does not exist
CREATE TABLE IF NOT EXISTS `db_migrations` (
    `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `migration` varchar(255) NOT NULL,
    `batch` int(11) NOT NULL,
    `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drop existing procedures if they exist
DROP PROCEDURE IF EXISTS `db_cli_add_migration`;
DROP PROCEDURE IF EXISTS `db_cli_delete_migration`;
DROP PROCEDURE IF EXISTS `db_cli_get_last_batch_migrations`;
DROP PROCEDURE IF EXISTS `db_cli_get_migrations`;

-- Create stored procedures
CREATE PROCEDURE `db_cli_add_migration`(
    IN `p_migration` VARCHAR(255),
    IN `p_batch` INT
)
BEGIN
    INSERT INTO db_migrations (`migration`, `batch`)
    VALUES (p_migration, p_batch);
END;

CREATE PROCEDURE `db_cli_delete_migration`(
    IN `p_node_migration_id` BIGINT(20)
)
BEGIN
    DELETE FROM db_migrations WHERE id = p_node_migration_id;
END;

CREATE PROCEDURE `db_cli_get_last_batch_migrations`()
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

CREATE PROCEDURE `db_cli_get_migrations`()
BEGIN
    SELECT id, migration, batch
    FROM db_migrations;
END;