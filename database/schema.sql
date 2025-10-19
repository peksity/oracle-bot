-- ═══════════════════════════════════════════════════════════════
-- ORACLE BOT - COMPLETE DATABASE SCHEMA
-- ═══════════════════════════════════════════════════════════════

-- Server Configuration
CREATE TABLE IF NOT EXISTS server_configs (
    server_id VARCHAR(255) PRIMARY KEY,
    setup_complete BOOLEAN DEFAULT FALSE,
    prefix VARCHAR(5) DEFAULT '!',
    welcome_channel VARCHAR(255),
    mod_log_channel VARCHAR(255),
    rules_channel VARCHAR(255),
    verify_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_server_id (server_id)
);

-- User Leveling & Experience
CREATE TABLE IF NOT EXISTS user_xp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    total_messages INT DEFAULT 0,
    last_xp_gain TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_server (user_id, server_id),
    INDEX idx_user_id (user_id),
    INDEX idx_server_id (server_id),
    INDEX idx_level (level),
    INDEX idx_xp (xp)
);

-- User Economy (Money/Items)
CREATE TABLE IF NOT EXISTS user_economy (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    balance BIGINT DEFAULT 0,
    bank INT DEFAULT 0,
    last_work TIMESTAMP,
    last_daily TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_server (user_id, server_id),
    INDEX idx_user_id (user_id),
    INDEX idx_server_id (server_id),
    INDEX idx_balance (balance)
);

-- User Inventory
CREATE TABLE IF NOT EXISTS user_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_server (user_id, server_id),
    INDEX idx_item_name (item_name)
);

-- Moderation Logs
CREATE TABLE IF NOT EXISTS mod_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    moderator_id VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_server_id (server_id),
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- User Warnings
CREATE TABLE IF NOT EXISTS user_warnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    moderator_id VARCHAR(255) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_server (user_id, server_id),
    INDEX idx_created_at (created_at)
);

-- Premium Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    tier ENUM('free', 'premium') DEFAULT 'free',
    trial_started TIMESTAMP,
    trial_ends TIMESTAMP,
    subscription_started TIMESTAMP,
    subscription_ends TIMESTAMP,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_server (user_id, server_id),
    INDEX idx_user_id (user_id),
    INDEX idx_server_id (server_id),
    INDEX idx_tier (tier),
    INDEX idx_trial_ends (trial_ends)
);

-- Trial Reminders (track which reminders sent)
CREATE TABLE IF NOT EXISTS trial_reminders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    reminder_day INT,
    sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    UNIQUE KEY unique_reminder (user_id, server_id, reminder_day),
    INDEX idx_user_server (user_id, server_id)
);

-- GTA 6 Leaks Database
CREATE TABLE IF NOT EXISTS gta6_leaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leak_title VARCHAR(255) NOT NULL,
    leak_description TEXT,
    source VARCHAR(100),
    credibility_score INT DEFAULT 5,
    proof_links TEXT,
    posted_at TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_credibility (credibility_score),
    INDEX idx_verified (verified)
);

-- GTA 6 News Cache
CREATE TABLE IF NOT EXISTS gta6_news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),
    url VARCHAR(500),
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fetched_at (fetched_at)
);

-- User Theories
CREATE TABLE IF NOT EXISTS user_theories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    theory_title VARCHAR(255) NOT NULL,
    theory_description TEXT,
    evidence TEXT,
    credibility_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_server (user_id, server_id),
    INDEX idx_credibility_votes (credibility_votes)
);

-- Theory Connections
CREATE TABLE IF NOT EXISTS theory_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    theory1_id INT NOT NULL,
    theory2_id INT NOT NULL,
    connection_reason TEXT,
    strength INT DEFAULT 5,
    FOREIGN KEY (theory1_id) REFERENCES user_theories(id) ON DELETE CASCADE,
    FOREIGN KEY (theory2_id) REFERENCES user_theories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_connection (theory1_id, theory2_id)
);

-- Server Hype Meter History
CREATE TABLE IF NOT EXISTS hype_meter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id VARCHAR(255) NOT NULL,
    hype_level INT DEFAULT 50,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_server_id (server_id),
    INDEX idx_recorded_at (recorded_at)
);

-- Time Capsule Predictions
CREATE TABLE IF NOT EXISTS time_capsules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    server_id VARCHAR(255) NOT NULL,
    prediction_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unseals_at TIMESTAMP,
    accuracy_score INT DEFAULT 0,
    unsealed BOOLEAN DEFAULT FALSE,
    INDEX idx_server_id (server_id),
    INDEX idx_unseals_at (unseals_at)
);

-- Error Logging
CREATE TABLE IF NOT EXISTS error_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    error_message TEXT,
    error_stack TEXT,
    command_name VARCHAR(100),
    user_id VARCHAR(255),
    server_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_command_name (command_name)
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

-- Create indexes for frequently queried combinations
CREATE INDEX idx_xp_level ON user_xp(server_id, level);
CREATE INDEX idx_economy_balance ON user_economy(server_id, balance);
CREATE INDEX idx_sub_tier_active ON subscriptions(tier, active);
CREATE INDEX idx_logs_date_range ON mod_logs(server_id, created_at);
CREATE INDEX idx_leaks_recent ON gta6_leaks(created_at, credibility_score);

-- ═══════════════════════════════════════════════════════════════
-- INIT COMPLETE
-- ═══════════════════════════════════════════════════════════════