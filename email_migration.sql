-- Email verification + password reset support
-- Run once: mysql -u root -p betaware_sa < email_migration.sql

ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN verification_token VARCHAR(255) DEFAULT NULL,
    ADD COLUMN verification_token_expires DATETIME DEFAULT NULL,
    ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
    ADD COLUMN reset_token_expires DATETIME DEFAULT NULL;