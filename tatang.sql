-- GenZ Social Media Database Schema
-- Created: July 12, 2025
-- Version: 1.0 (Tatang Edition)

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS genzsocial;
USE genzsocial;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT,
    image TEXT,
    music TEXT,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Stories table
CREATE TABLE stories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table (for session management)
CREATE TABLE sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT,
    data TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (username, display_name, email, password, avatar, bio, followers, following, posts_count, is_verified, is_admin) VALUES
('andi_jakarta', 'Andi Pratama', 'andi@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Software Developer • Jakarta • Coffee lover ☕', 1234, 567, 45, TRUE, FALSE),
('sari_bandung', 'Sari Dewi', 'sari@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1494790108755-2616b9c7ed95?w=150&h=150&fit=crop&crop=face', 'UI/UX Designer • Bandung • Art enthusiast 🎨', 2345, 890, 67, TRUE, FALSE),
('budi_surabaya', 'Budi Santoso', 'budi@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Content Creator • Surabaya • Food blogger 🍜', 3456, 1234, 89, FALSE, FALSE),
('dina_yogya', 'Dina Maharani', 'dina@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Photographer • Yogyakarta • Culture lover 📸', 4567, 2345, 123, TRUE, FALSE),
('maya_bali', 'Maya Sari', 'maya@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Travel blogger • Bali • Beach lover 🏖️', 2340, 1580, 89, TRUE, FALSE),
('reza_surabaya', 'Reza Ahmad', 'reza@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Mahasiswa ITS • Coding enthusiast', 789, 567, 34, FALSE, FALSE),
('admin', 'Administrator', 'admin@genzsocial.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Admin GenZ Social Media', 0, 0, 0, TRUE, TRUE);

-- Insert sample posts
INSERT INTO posts (user_id, content, likes) VALUES
(1, 'Selamat datang di GenZ Social Media! 🎉', 5);

-- Insert sample stories
INSERT INTO stories (user_id, image) VALUES
(1, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop'),
(2, 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop'),
(3, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop');

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Create triggers for automatic updates
DELIMITER //

CREATE TRIGGER update_posts_count_insert 
AFTER INSERT ON posts 
FOR EACH ROW 
BEGIN
    UPDATE users SET posts_count = posts_count + 1 WHERE id = NEW.user_id;
END//

CREATE TRIGGER update_posts_count_delete 
AFTER DELETE ON posts 
FOR EACH ROW 
BEGIN
    UPDATE users SET posts_count = posts_count - 1 WHERE id = OLD.user_id;
END//

DELIMITER ;

-- Clean up expired stories (can be run as a scheduled job)
-- DELETE FROM stories WHERE expires_at < NOW();