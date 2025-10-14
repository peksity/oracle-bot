-- ═══════════════════════════════════════════════════════════════
-- GTA VI DOMINION - DATABASE SCHEMA
-- Created by: Peksity
-- Version: 1.0.0
-- ═══════════════════════════════════════════════════════════════

-- Create database
CREATE DATABASE IF NOT EXISTS gta_vi_dominion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gta_vi_dominion;

-- ═══════════════════════════════════════════════════════════════
-- USERS & MEMBERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    discriminator VARCHAR(10),
    global_name VARCHAR(255),
    avatar_url TEXT,
    created_at BIGINT NOT NULL,
    first_seen BIGINT NOT NULL,
    last_seen BIGINT NOT NULL,
    message_count INT DEFAULT 0,
    total_xp INT DEFAULT 0,
    level INT DEFAULT 0,
    voice_minutes INT DEFAULT 0,
    warnings INT DEFAULT 0,
    kicks INT DEFAULT 0,
    bans INT DEFAULT 0,
    credibility_score INT DEFAULT 100,
    is_verified BOOLEAN DEFAULT FALSE,
    website_user_id INT DEFAULT NULL,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    subscription_expires BIGINT DEFAULT NULL,
    notes TEXT,
    INDEX idx_username (username),
    INDEX idx_credibility (credibility_score),
    INDEX idx_verified (is_verified)
);

-- ═══════════════════════════════════════════════════════════════
-- MESSAGE HISTORY (Perfect Memory)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS message_history (
    message_id BIGINT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    guild_id BIGINT NOT NULL,
    content TEXT,
    attachments JSON,
    embeds JSON,
    mentions JSON,
    timestamp BIGINT NOT NULL,
    edited BOOLEAN DEFAULT FALSE,
    edited_at BIGINT,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_channel (channel_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_deleted (deleted)
);

-- ═══════════════════════════════════════════════════════════════
-- TICKETS SYSTEM
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    ticket_number INT AUTO_INCREMENT UNIQUE,
    user_id BIGINT NOT NULL,
    channel_id BIGINT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(50) DEFAULT 'open',
    priority INT DEFAULT 5,
    assigned_mods JSON,
    created_at BIGINT NOT NULL,
    closed_at BIGINT,
    resolution TEXT,
    satisfaction_rating INT,
    ai_resolved BOOLEAN DEFAULT FALSE,
    escalated BOOLEAN DEFAULT FALSE,
    mod_alert_message_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_created (created_at)
);

CREATE TABLE IF NOT EXISTS ticket_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL,
    user_id BIGINT,
    speaker ENUM('user', 'ai', 'mod') NOT NULL,
    message_num INT NOT NULL,
    content TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    context_data JSON,
    FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    INDEX idx_ticket (ticket_id),
    INDEX idx_timestamp (timestamp)
);

-- ═══════════════════════════════════════════════════════════════
-- CONTRADICTION DETECTION
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS user_statements (
    statement_id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    about_user_id BIGINT,
    claim TEXT NOT NULL,
    context TEXT,
    timestamp BIGINT NOT NULL,
    ticket_id VARCHAR(50),
    message_id BIGINT,
    verified BOOLEAN DEFAULT FALSE,
    contradicts JSON,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_about (about_user_id),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE IF NOT EXISTS contradiction_map (
    id INT AUTO_INCREMENT PRIMARY KEY,
    statement_a_id VARCHAR(50) NOT NULL,
    statement_b_id VARCHAR(50) NOT NULL,
    contradiction_type ENUM('timeline', 'facts', 'claims', 'perspective', 'no_contradiction'),
    severity INT NOT NULL,
    detected_at BIGINT NOT NULL,
    evidence JSON,
    FOREIGN KEY (statement_a_id) REFERENCES user_statements(statement_id),
    FOREIGN KEY (statement_b_id) REFERENCES user_statements(statement_id),
    INDEX idx_severity (severity),
    INDEX idx_detected (detected_at)
);

-- ═══════════════════════════════════════════════════════════════
-- DRAMA & INCIDENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS drama_incidents (
    incident_id VARCHAR(50) PRIMARY KEY,
    participants JSON NOT NULL,
    channel_id BIGINT NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT,
    severity INT NOT NULL,
    messages JSON,
    resolution TEXT,
    related_tickets JSON,
    auto_moderated BOOLEAN DEFAULT FALSE,
    INDEX idx_channel (channel_id),
    INDEX idx_severity (severity),
    INDEX idx_start (start_time)
);

-- ═══════════════════════════════════════════════════════════════
-- MODERATION ACTIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS punishments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    moderator_id BIGINT,
    type ENUM('warn', 'mute', 'kick', 'ban') NOT NULL,
    reason TEXT NOT NULL,
    duration BIGINT,
    timestamp BIGINT NOT NULL,
    expires_at BIGINT,
    active BOOLEAN DEFAULT TRUE,
    evidence JSON,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_active (active),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE IF NOT EXISTS mod_actions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    moderator_id BIGINT,
    target_user_id BIGINT,
    action_data JSON,
    timestamp BIGINT NOT NULL,
    INDEX idx_moderator (moderator_id),
    INDEX idx_type (type),
    INDEX idx_timestamp (timestamp)
);

-- ═══════════════════════════════════════════════════════════════
-- AI & LEARNING
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS ai_interactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    interaction_type VARCHAR(100) NOT NULL,
    context JSON,
    user_input TEXT,
    ai_response TEXT,
    sentiment VARCHAR(50),
    timestamp BIGINT NOT NULL,
    successful BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    INDEX idx_user (user_id),
    INDEX idx_type (interaction_type),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE IF NOT EXISTS ai_learnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    situation TEXT NOT NULL,
    what_worked TEXT,
    what_didnt_work TEXT,
    recommendation TEXT,
    confidence FLOAT DEFAULT 0.5,
    times_applied INT DEFAULT 0,
    success_rate FLOAT DEFAULT 0,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    INDEX idx_category (category),
    INDEX idx_confidence (confidence)
);

-- ═══════════════════════════════════════════════════════════════
-- ROCKSTAR NEWS MONITORING
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rockstar_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id VARCHAR(255) UNIQUE NOT NULL,
    game ENUM('gta5', 'gta6', 'rdr2', 'general') NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category VARCHAR(100),
    analysis JSON,
    date_published BIGINT NOT NULL,
    date_posted_discord BIGINT NOT NULL,
    image_url TEXT,
    tags JSON,
    discord_message_id BIGINT,
    INDEX idx_game (game),
    INDEX idx_category (category),
    INDEX idx_published (date_published)
);

CREATE TABLE IF NOT EXISTS social_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform ENUM('twitter', 'youtube', 'instagram') NOT NULL,
    post_id VARCHAR(255) UNIQUE NOT NULL,
    content TEXT,
    url TEXT NOT NULL,
    posted_at BIGINT NOT NULL,
    posted_to_discord BIGINT NOT NULL,
    engagement JSON,
    INDEX idx_platform (platform),
    INDEX idx_posted (posted_at)
);

-- ═══════════════════════════════════════════════════════════════
-- SERVER CONFIGURATION
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS server_config (
    guild_id BIGINT PRIMARY KEY,
    guild_name VARCHAR(255) NOT NULL,
    primary_game VARCHAR(50) DEFAULT 'gta5',
    monitoring_priority JSON,
    setup_completed BOOLEAN DEFAULT FALSE,
    setup_step INT DEFAULT 0,
    config_data JSON,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

-- ═══════════════════════════════════════════════════════════════
-- SECURITY & LOGS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS security_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    user_id BIGINT,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    description TEXT NOT NULL,
    data JSON,
    timestamp BIGINT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    INDEX idx_type (event_type),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_id BIGINT,
    target_id BIGINT,
    details JSON,
    timestamp BIGINT NOT NULL,
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════

-- Composite indexes for common queries
CREATE INDEX idx_user_timestamp ON message_history(user_id, timestamp);
CREATE INDEX idx_ticket_status_created ON tickets(status, created_at);
CREATE INDEX idx_punishment_user_active ON punishments(user_id, active);

-- ═══════════════════════════════════════════════════════════════
-- INITIAL DATA
-- ═══════════════════════════════════════════════════════════════

-- Insert default server config (will be updated on bot startup)
INSERT IGNORE INTO server_config (guild_id, guild_name, created_at, updated_at)
VALUES (0, 'Default', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);
