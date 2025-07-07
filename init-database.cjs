const Database = require('better-sqlite3');

// Create new database
const db = new Database('database.sqlite');

// Create tables with music column
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    bio TEXT DEFAULT '',
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_verified INTEGER DEFAULT 0,
    join_date TEXT DEFAULT '2024-01-01',
    is_online INTEGER DEFAULT 1
  );
  
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    music TEXT,
    timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
  
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
    likes INTEGER DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
  
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
    is_viewed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Insert sample users
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, username, password, display_name, avatar, bio, followers, following, posts_count, is_verified, join_date, is_online)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const users = [
  [1, 'sarah_chen', 'password123', 'Sarah Chen', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', 'Content creator & traveler', 1250, 340, 85, 1, '2023-01-15', 1],
  [2, 'alex_dev', 'password123', 'Alex Rodriguez', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'Full-stack developer 💻', 856, 1034, 42, 0, '2023-03-20', 1],
  [3, 'maya_art', 'password123', 'Maya Johnson', 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150', 'Digital artist & designer', 2103, 567, 128, 1, '2022-11-08', 0],
  [4, 'david_music', 'password123', 'David Kim', 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150', 'Music producer & DJ', 3456, 789, 76, 1, '2023-02-14', 1]
];

users.forEach(user => insertUser.run(...user));

// Insert sample posts
const insertPost = db.prepare(`
  INSERT OR REPLACE INTO posts (id, user_id, content, image, music, timestamp, likes, shares)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const posts = [
  [1, 1, 'Beautiful sunset from my trip to Bali! 🌅', 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=600', null, '2024-01-02T10:30:00.000Z', 42, 8],
  [2, 2, 'Just finished coding a new React component. Love the satisfaction of clean code! 💻', null, null, '2024-01-02T14:15:00.000Z', 28, 3],
  [3, 3, 'New digital artwork I created today. What do you think?', 'https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg?auto=compress&cs=tinysrgb&w=600', null, '2024-01-01T16:45:00.000Z', 89, 12],
  [4, 4, 'Working on my latest track 🎵', null, '{"name":"Midnight Vibes","artist":"David Kim","album":"Underground Beats","preview_url":"","image":"https://images.pexels.com/photos/1644895/pexels-photo-1644895.jpeg?auto=compress&cs=tinysrgb&w=300"}', '2024-01-01T20:30:00.000Z', 156, 24]
];

posts.forEach(post => insertPost.run(...post));

// Insert sample comments
const insertComment = db.prepare(`
  INSERT OR REPLACE INTO comments (id, post_id, user_id, content, timestamp, likes)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const comments = [
  [1, 1, 2, 'Wow, amazing view! 😍', '2024-01-02T11:00:00.000Z', 5],
  [2, 1, 3, 'Bali is definitely on my bucket list now!', '2024-01-02T11:30:00.000Z', 3],
  [3, 2, 1, 'Clean code is the best code! 👍', '2024-01-02T14:45:00.000Z', 7],
  [4, 3, 2, 'Your art style is incredible!', '2024-01-01T17:00:00.000Z', 12],
  [5, 4, 1, 'Can\'t wait to hear the full track! 🎶', '2024-01-01T21:00:00.000Z', 8]
];

comments.forEach(comment => insertComment.run(...comment));

// Insert sample stories
const insertStory = db.prepare(`
  INSERT OR REPLACE INTO stories (id, user_id, image, timestamp, is_viewed)
  VALUES (?, ?, ?, ?, ?)
`);

const stories = [
  [1, 1, 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300', '2024-01-02T08:00:00.000Z', 0],
  [2, 2, 'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=300', '2024-01-02T12:00:00.000Z', 0],
  [3, 3, 'https://images.pexels.com/photos/1161547/pexels-photo-1161547.jpeg?auto=compress&cs=tinysrgb&w=300', '2024-01-01T18:00:00.000Z', 1]
];

stories.forEach(story => insertStory.run(...story));

console.log('Database initialized successfully with sample data including music support!');
db.close();