-- BetAware SA — Database Schema
-- Run this once against your MySQL server to create the database and tables:
--   mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS betaware_sa;
USE betaware_sa;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    monthly_salary DECIMAL(10, 2) NOT NULL,
    betting_percentage DECIMAL(5, 2) DEFAULT 10.00,
    monthly_budget DECIMAL(10, 2) NOT NULL,
    current_balance DECIMAL(10, 2) NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    last_gamble_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- 2. EXPENSES / BETS TABLE (multi-platform tracking)
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    betting_site ENUM('Hollywood Bets', 'Betway', 'Sportingbet', 'Supabets', 'Lotto', 'SunBet', 'Other') NOT NULL,
    category VARCHAR(50) DEFAULT 'Sports',
    source ENUM('Manual', 'SMS_Parser', 'Quick_Add') DEFAULT 'Manual',
    notes TEXT,
    date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date_time)
);

-- 3. URGE LOGS TABLE (behavioral harm reduction)
CREATE TABLE IF NOT EXISTS urge_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    intensity INT NOT NULL CHECK (intensity BETWEEN 1 AND 10),
    trigger_type ENUM('Boredom', 'Alcohol', 'Payday', 'Chasing Losses', 'Match FOMO', 'Stress', 'Other'),
    duration_minutes INT DEFAULT 15,
    outcome ENUM('Overcame', 'Bet Placed') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. EMERGENCY & SELF-EXCLUSION AUDIT TABLE
CREATE TABLE IF NOT EXISTS self_exclusions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    status ENUM('Requested', 'Active', 'Completed') DEFAULT 'Requested',
    period_months INT DEFAULT 6,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
