<?php
session_start();

// Database configuration
$host = 'localhost';
$dbname = 'social_media';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Fallback to SQLite if MySQL not available
    $pdo = new PDO("sqlite:database.db");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

// Initialize database tables if not exists
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '',
    bio TEXT DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    website VARCHAR(255) DEFAULT '',
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    is_online BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255) DEFAULT '',
    music_data TEXT DEFAULT '',
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id INTEGER NOT NULL,
    following_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS post_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)");
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GenZ Social Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.js" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.js"></script>
    <link rel="stylesheet" href="assets/styles.css">
</head>
<body class="bg-gray-50">
    <!-- Splash Screen -->
    <div id="splash-screen" class="fixed inset-0 z-50 flex items-center justify-center splash-gradient">
        <div class="text-center text-white">
            <div class="mb-8">
                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="zap" class="w-10 h-10 text-purple-600"></i>
                </div>
                <h1 class="text-4xl font-bold mb-2">GenZ</h1>
                <p class="text-lg opacity-90">Media Sosial Generasi Z</p>
            </div>
            <div class="w-16 h-1 bg-white rounded-full mx-auto animate-pulse"></div>
        </div>
    </div>

    <!-- Main App -->
    <div id="main-app" class="hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b px-4 py-3">
            <div class="max-w-6xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <i data-lucide="zap" class="w-5 h-5 text-white"></i>
                    </div>
                    <h1 class="text-xl font-bold text-gray-900">GenZ</h1>
                </div>
                
                <div class="flex items-center space-x-4">
                    <button id="search-btn" class="p-2 hover:bg-gray-100 rounded-full">
                        <i data-lucide="search" class="w-5 h-5 text-gray-600"></i>
                    </button>
                    <button id="notifications-btn" class="p-2 hover:bg-gray-100 rounded-full relative">
                        <i data-lucide="bell" class="w-5 h-5 text-gray-600"></i>
                        <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    <button id="profile-btn" class="w-8 h-8 bg-gray-300 rounded-full">
                        <i data-lucide="user" class="w-4 h-4 text-gray-600 mx-auto"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="max-w-6xl mx-auto px-4 py-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Sidebar -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div class="text-center mb-6">
                            <div class="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3">
                                <i data-lucide="user" class="w-8 h-8 text-gray-600 mx-auto mt-4"></i>
                            </div>
                            <h3 class="font-semibold text-gray-900">Selamat Datang</h3>
                            <p class="text-sm text-gray-500">Bergabunglah dengan komunitas GenZ</p>
                        </div>
                        
                        <nav class="space-y-2">
                            <a href="#" class="flex items-center space-x-3 text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                                <i data-lucide="home" class="w-5 h-5"></i>
                                <span>Beranda</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                                <i data-lucide="users" class="w-5 h-5"></i>
                                <span>Cari Teman</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                                <i data-lucide="message-circle" class="w-5 h-5"></i>
                                <span>Chat</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                                <i data-lucide="user" class="w-5 h-5"></i>
                                <span>Profil</span>
                            </a>
                            <a href="#" class="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                                <i data-lucide="menu" class="w-5 h-5"></i>
                                <span>Menu</span>
                            </a>
                        </nav>
                    </div>
                </div>

                <!-- Main Feed -->
                <div class="lg:col-span-2">
                    <!-- Stories Section -->
                    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 class="text-lg font-semibold mb-4">Stories</h2>
                        <div id="stories-container" class="flex space-x-4 overflow-x-auto pb-2">
                            <!-- Stories will be populated by JavaScript -->
                        </div>
                    </div>

                    <!-- Create Post -->
                    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-10 h-10 bg-gray-300 rounded-full">
                                <i data-lucide="user" class="w-5 h-5 text-gray-600 mx-auto mt-2.5"></i>
                            </div>
                            <button class="flex-1 bg-gray-100 rounded-full px-4 py-2 text-left text-gray-500 hover:bg-gray-200 transition-colors">
                                Apa yang kamu pikirkan?
                            </button>
                        </div>
                        
                        <div class="flex items-center justify-between pt-3 border-t">
                            <div class="flex space-x-4">
                                <button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <i data-lucide="image" class="w-5 h-5"></i>
                                    <span class="text-sm">Foto</span>
                                </button>
                                <button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <i data-lucide="music" class="w-5 h-5"></i>
                                    <span class="text-sm">Musik</span>
                                </button>
                                <button class="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                                    <i data-lucide="smile" class="w-5 h-5"></i>
                                    <span class="text-sm">Emoji</span>
                                </button>
                            </div>
                            <button class="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors">
                                Posting
                            </button>
                        </div>
                    </div>

                    <!-- Posts Container -->
                    <div id="posts-container">
                        <!-- Posts will be populated by JavaScript -->
                    </div>
                </div>

                <!-- Right Sidebar -->
                <div class="lg:col-span-1">
                    <!-- Trending -->
                    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 class="text-lg font-semibold mb-4">Trending</h2>
                        <div class="space-y-3">
                            <div class="text-center py-8">
                                <i data-lucide="trending-up" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                                <p class="text-sm text-gray-500">Belum ada trending topic</p>
                            </div>
                        </div>
                    </div>

                    <!-- Suggested Friends -->
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <h2 class="text-lg font-semibold mb-4">Teman yang Disarankan</h2>
                        <div class="space-y-3">
                            <div class="text-center py-8">
                                <i data-lucide="user-plus" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                                <p class="text-sm text-gray-500">Belum ada saran teman</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
            <div class="flex items-center justify-around py-2">
                <button class="mobile-nav-btn flex flex-col items-center space-y-1 text-purple-600 py-2" data-page="home">
                    <i data-lucide="home" class="w-6 h-6"></i>
                    <span class="text-xs">Beranda</span>
                </button>
                <button class="mobile-nav-btn flex flex-col items-center space-y-1 text-gray-600 py-2" data-page="search">
                    <i data-lucide="users" class="w-6 h-6"></i>
                    <span class="text-xs">Cari</span>
                </button>
                <button class="mobile-nav-btn flex flex-col items-center space-y-1 text-gray-600 py-2" data-page="chat">
                    <i data-lucide="message-circle" class="w-6 h-6"></i>
                    <span class="text-xs">Chat</span>
                </button>
                <button class="mobile-nav-btn flex flex-col items-center space-y-1 text-gray-600 py-2" data-page="profile">
                    <i data-lucide="user" class="w-6 h-6"></i>
                    <span class="text-xs">Profil</span>
                </button>
                <button class="mobile-nav-btn flex flex-col items-center space-y-1 text-gray-600 py-2" data-page="more">
                    <i data-lucide="menu" class="w-6 h-6"></i>
                    <span class="text-xs">Menu</span>
                </button>
            </div>
        </div>
    </div>

    <script src="js/app.js"></script>
</body>
</html>