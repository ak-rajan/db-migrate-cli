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
DROP PROCEDURE IF EXISTS `executeQuery`;

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

CREATE PROCEDURE `executeQuery`(
    IN `p_sql_query` LONGTEXT,
    OUT `p_status` LONGTEXT
)
BEGIN
    DECLARE stmt LONGTEXT;

    -- Declare a handler for SQL exceptions
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        DECLARE v_error_message VARCHAR(255);
        GET DIAGNOSTICS CONDITION 1 v_error_message = MESSAGE_TEXT;
        SET p_status = CONCAT('Error: ', v_error_message);
    END;

    SET p_status = 'Success';
    SET stmt = p_sql_query;
    PREPARE dynamic_stmt FROM stmt;
    EXECUTE dynamic_stmt;
    DEALLOCATE PREPARE dynamic_stmt;
END;
