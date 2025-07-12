-- ============================================
-- GenZ Social Media Database Schema
-- Standalone SQL - Compatible with MySQL, PostgreSQL, SQLite
-- ============================================

-- Drop tables if exist (for clean install)
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(200),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Posts Table
-- ============================================
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    music_data JSON,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Comments Table
-- ============================================
CREATE TABLE comments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    parent_id INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ============================================
-- Stories Table
-- ============================================
CREATE TABLE stories (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    caption TEXT,
    views INTEGER DEFAULT 0,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 24 HOUR),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Sample Data - Indonesian Users
-- ============================================
INSERT INTO users (username, display_name, email, avatar, bio, location, is_verified, followers, following, posts_count) VALUES
('andi_jakarta', 'Andi Pratama', 'andi@email.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', 'Pecinta kopi dan teknologi dari Jakarta ☕', 'Jakarta, Indonesia', TRUE, 15420, 892, 127),

('sari_bandung', 'Sari Dewi', 'sari@email.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b765?w=100&h=100&fit=crop&crop=face', 'Content creator & photographer 📸 Bandung', 'Bandung, Indonesia', TRUE, 12890, 567, 89),

('budi_surabaya', 'Budi Santoso', 'budi@email.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', 'Entrepreneur | Startup enthusiast 🚀', 'Surabaya, Indonesia', FALSE, 8745, 434, 156),

('maya_yogya', 'Maya Putri', 'maya@email.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', 'Art lover & culture enthusiast 🎨 Yogyakarta', 'Yogyakarta, Indonesia', TRUE, 22340, 1205, 203),

('rizki_bali', 'Rizki Ramadhan', 'rizki@email.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', 'Digital nomad living in paradise 🏝️', 'Bali, Indonesia', FALSE, 6789, 892, 78),

('admin_genz', 'GenZ Admin', 'admin@genz.com', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face', 'Administrator akun resmi GenZ Social 👨‍💼', 'Indonesia', TRUE, 95420, 12, 45);

-- ============================================
-- Sample Posts - Indonesian Content
-- ============================================
INSERT INTO posts (user_id, content, likes, shares, comments_count) VALUES
(1, 'Pagi yang cerah di Jakarta! Semangat bekerja dari rumah sambil minum kopi ☕ #MorningVibes #WorkFromHome', 127, 23, 15),

(2, 'Sesi foto pre-wedding di Taman Bunga Begonia Lembang kemarin. Hasilnya memukau banget! 📸✨ #Photography #Bandung', 89, 34, 12),

(3, 'Startup pertama saya akhirnya launching hari ini! Terima kasih untuk semua dukungannya 🚀 #StartupLife #Entrepreneur', 156, 67, 28),

(4, 'Mengunjungi Taman Sari Yogyakarta dan takjub dengan arsitektur Jawa yang megah 🏛️ #Culture #Yogyakarta', 203, 45, 19),

(5, 'Sunset di Pantai Kuta tidak pernah mengecewakan. Hidup nomad di Bali memang luar biasa! 🌅 #Bali #DigitalNomad', 78, 29, 8),

(6, 'Selamat datang di GenZ Social! Platform media sosial terbaru untuk generasi muda Indonesia 🎉 #Welcome #GenZ', 245, 89, 42),

(1, 'Baru saja selesai meeting dengan tim. Proyek baru kita bakal keren banget! Stay tuned 💼', 67, 12, 7),

(2, 'Tips fotografi: Golden hour adalah waktu terbaik untuk portrait. Cahayanya natural dan warm 📷', 134, 56, 21),

(3, 'Networking event di Surabaya hari ini sangat inspiring. Bertemu banyak founder muda berbakat! 🤝', 92, 18, 11),

(4, 'Workshop batik tradisional di Malioboro Street. Belajar teknik pewarnaan yang sudah berabad-abad 🎨', 167, 38, 16);

-- ============================================
-- Sample Comments
-- ============================================
INSERT INTO comments (post_id, user_id, content, likes) VALUES
(1, 2, 'Setuju banget! Kopi pagi memang boost produktivitas 💪', 12),
(1, 3, 'Jakarta macet tapi semangatnya tetap tinggi ya! 😄', 8),
(2, 1, 'Wah hasil fotonya pasti bagus banget! Share dong', 15),
(3, 4, 'Congratulations! Semoga sukses startupnya 🎉', 23),
(4, 5, 'Yogya memang kaya budaya. Kapan-kapan main kesana ah', 7),
(5, 1, 'Pengen banget ke Bali juga! Pantainya indah', 19),
(6, 2, 'Akhirnya ada platform local! Semangat GenZ 🔥', 34);

-- ============================================
-- Sample Stories
-- ============================================
INSERT INTO stories (user_id, image, caption, views) VALUES
(1, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=600&fit=crop', 'Morning coffee routine ☕', 234),
(2, 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400&h=600&fit=crop', 'Behind the scenes photoshoot 📸', 189),
(3, 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop', 'Startup meeting room vibes 💼', 156),
(4, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 'Traditional art workshop 🎨', 278),
(5, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop', 'Beach working session 🏖️', 312);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- Views for Easy Queries
-- ============================================

-- Posts with user info
CREATE VIEW posts_with_users AS
SELECT 
    p.*,
    u.username,
    u.display_name,
    u.avatar,
    u.is_verified
FROM posts p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- Stories with user info
CREATE VIEW stories_with_users AS
SELECT 
    s.*,
    u.username,
    u.display_name,
    u.avatar,
    u.is_verified
FROM stories s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > CURRENT_TIMESTAMP
ORDER BY s.created_at DESC;

-- Comments with user info
CREATE VIEW comments_with_users AS
SELECT 
    c.*,
    u.username,
    u.display_name,
    u.avatar,
    u.is_verified
FROM comments c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at ASC;

-- ============================================
-- Stored Procedures (MySQL/PostgreSQL)
-- ============================================

-- Update post counts
DELIMITER //
CREATE PROCEDURE UpdateUserPostCount(IN userId INT)
BEGIN
    UPDATE users 
    SET posts_count = (
        SELECT COUNT(*) 
        FROM posts 
        WHERE user_id = userId
    )
    WHERE id = userId;
END //
DELIMITER ;

-- Like a post
DELIMITER //
CREATE PROCEDURE LikePost(IN postId INT)
BEGIN
    UPDATE posts 
    SET likes = likes + 1 
    WHERE id = postId;
END //
DELIMITER ;

-- ============================================
-- Triggers for Data Consistency
-- ============================================

-- Update post count when new post is created
DELIMITER //
CREATE TRIGGER after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
    UPDATE users 
    SET posts_count = posts_count + 1 
    WHERE id = NEW.user_id;
END //
DELIMITER ;

-- Update post count when post is deleted
DELIMITER //
CREATE TRIGGER after_post_delete
AFTER DELETE ON posts
FOR EACH ROW
BEGIN
    UPDATE users 
    SET posts_count = posts_count - 1 
    WHERE id = OLD.user_id;
END //
DELIMITER ;

-- Update comment count when comment is added
DELIMITER //
CREATE TRIGGER after_comment_insert
AFTER INSERT ON comments
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET comments_count = comments_count + 1 
    WHERE id = NEW.post_id;
END //
DELIMITER ;

-- Update comment count when comment is deleted
DELIMITER //
CREATE TRIGGER after_comment_delete
AFTER DELETE ON comments
FOR EACH ROW
BEGIN
    UPDATE posts 
    SET comments_count = comments_count - 1 
    WHERE id = OLD.post_id;
END //
DELIMITER ;

-- ============================================
-- Sample Queries for Testing
-- ============================================

-- Get all posts with user info
-- SELECT * FROM posts_with_users LIMIT 10;

-- Get user profile with stats
-- SELECT username, display_name, bio, followers, following, posts_count 
-- FROM users WHERE username = 'andi_jakarta';

-- Get comments for a specific post
-- SELECT * FROM comments_with_users WHERE post_id = 1;

-- Get active stories
-- SELECT * FROM stories_with_users;

-- Search users by name or username
-- SELECT * FROM users 
-- WHERE display_name LIKE '%andi%' OR username LIKE '%andi%';

-- Get trending posts (most liked)
-- SELECT * FROM posts_with_users 
-- ORDER BY likes DESC LIMIT 10;

-- ============================================
-- Database Stats Summary
-- ============================================
-- Total Tables: 4 (users, posts, comments, stories)
-- Total Sample Users: 6
-- Total Sample Posts: 10
-- Total Sample Comments: 7
-- Total Sample Stories: 5
-- Total Views: 3
-- Total Procedures: 2
-- Total Triggers: 4
-- Total Indexes: 8
-- ============================================