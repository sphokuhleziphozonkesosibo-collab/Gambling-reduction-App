-- PGSI Clinical Assessment — adds columns to store each user's score
-- Run this once against your existing database:
--   mysql -u root -p betaware_sa < pgsi_migration.sql

ALTER TABLE users
    ADD COLUMN pgsi_score INT DEFAULT NULL,
    ADD COLUMN pgsi_risk_level VARCHAR(20) DEFAULT NULL,
    ADD COLUMN pgsi_completed_at DATETIME DEFAULT NULL;