<?php
session_start();

// Database configuration - SQLite untuk kesederhanaan
try {
    $pdo = new PDO("sqlite:social_media.db");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Initialize database tables
$pdo->exec("CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(255) DEFAULT '',
    bio TEXT DEFAULT '',
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    content TEXT NOT NULL,
    image VARCHAR(255) DEFAULT '',
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER DEFAULT 1,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");

// Add sample data if tables are empty
$userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
if ($userCount == 0) {
    $pdo->exec("INSERT INTO users (username, display_name, avatar, bio, followers, following, posts_count, is_verified) VALUES
        ('andi_jakarta', 'Andi Pratama', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Pecinta kopi dan teknologi dari Jakarta', 1250, 890, 45, 1),
        ('sari_bandung', 'Sari Melati', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Desainer grafis • Bandung • Cat lover 🐱', 890, 654, 32, 0),
        ('budi_jogja', 'Budi Santoso', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Mahasiswa UGM • Fotografer pemula', 567, 423, 28, 0)");
    
    $pdo->exec("INSERT INTO posts (user_id, content, likes) VALUES
        (1, 'Hari yang indah untuk ngopi sambil coding! ☕ Ada yang mau join?', 24),
        (2, 'Baru selesai bikin design poster untuk event kampus. Gimana menurut kalian?', 18),
        (3, 'Sunrise di Malioboro pagi ini cantik banget! 🌅', 31)");
}

// API Handler
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    switch ($_GET['action']) {
        case 'posts':
            $stmt = $pdo->query("
                SELECT p.*, u.username, u.display_name, u.avatar, u.is_verified 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC
            ");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
            
        case 'create_post':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("INSERT INTO posts (user_id, content) VALUES (1, ?)");
            $stmt->execute([$input['content']]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            exit;
            
        case 'stories':
            $stmt = $pdo->query("
                SELECT s.*, u.username, u.display_name, u.avatar 
                FROM stories s 
                JOIN users u ON s.user_id = u.id 
                ORDER BY s.created_at DESC
            ");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
            
        case 'like_post':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?");
            $stmt->execute([$input['postId']]);
            echo json_encode(['success' => true]);
            exit;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GenZ Social Media</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .glass { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1); }
        .hover-scale { transition: transform 0.2s; }
        .hover-scale:hover { transform: scale(1.05); }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="gradient-bg text-white p-4 sticky top-0 z-50">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <h1 class="text-2xl font-bold">GenZ</h1>
            <div class="flex items-center space-x-4">
                <button onclick="showCreatePost()" class="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover-scale">
                    <i class="fas fa-plus mr-2"></i>Post
                </button>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" 
                     class="w-10 h-10 rounded-full border-2 border-white">
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto p-4">
        <!-- Stories Section -->
        <div class="mb-6">
            <div class="flex space-x-4 overflow-x-auto pb-4">
                <div class="flex-shrink-0 text-center cursor-pointer" onclick="showCreateStory()">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                        <i class="fas fa-plus text-xl"></i>
                    </div>
                    <p class="text-sm mt-2">Your Story</p>
                </div>
                <div id="stories-container" class="flex space-x-4">
                    <!-- Stories will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Posts Section -->
        <div id="posts-container" class="space-y-6">
            <!-- Posts will be loaded here -->
        </div>
    </div>

    <!-- Create Post Modal -->
    <div id="createPostModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Buat Post Baru</h3>
                <button onclick="hideCreatePost()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <textarea id="postContent" placeholder="Apa yang kamu pikirkan?" 
                      class="w-full p-3 border rounded-lg resize-none" rows="4"></textarea>
            <div class="flex justify-end mt-4">
                <button onclick="createPost()" class="gradient-bg text-white px-6 py-2 rounded-lg font-semibold">
                    Post
                </button>
            </div>
        </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div class="max-w-4xl mx-auto px-4">
            <div class="flex justify-around py-3">
                <button class="flex flex-col items-center text-purple-600">
                    <i class="fas fa-home text-xl"></i>
                    <span class="text-xs mt-1">Beranda</span>
                </button>
                <button class="flex flex-col items-center text-gray-500">
                    <i class="fas fa-search text-xl"></i>
                    <span class="text-xs mt-1">Cari</span>
                </button>
                <button class="flex flex-col items-center text-gray-500">
                    <i class="fas fa-comment text-xl"></i>
                    <span class="text-xs mt-1">Chat</span>
                </button>
                <button class="flex flex-col items-center text-gray-500">
                    <i class="fas fa-user text-xl"></i>
                    <span class="text-xs mt-1">Profil</span>
                </button>
            </div>
        </div>
    </nav>

    <script>
        // Load posts and stories on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadPosts();
            loadStories();
        });

        // Load posts from server
        async function loadPosts() {
            try {
                const response = await fetch('?action=posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const posts = await response.json();
                
                const container = document.getElementById('posts-container');
                container.innerHTML = posts.map(post => `
                    <div class="bg-white rounded-lg shadow-md p-6">
                        <div class="flex items-center mb-4">
                            <img src="${post.avatar}" class="w-12 h-12 rounded-full mr-3">
                            <div class="flex-1">
                                <div class="flex items-center">
                                    <h3 class="font-semibold">${post.display_name}</h3>
                                    ${post.is_verified ? '<i class="fas fa-check-circle text-blue-500 ml-1"></i>' : ''}
                                </div>
                                <p class="text-gray-500 text-sm">@${post.username}</p>
                            </div>
                        </div>
                        <p class="text-gray-800 mb-4">${post.content}</p>
                        <div class="flex items-center justify-between text-gray-500">
                            <button onclick="likePost(${post.id})" class="flex items-center space-x-2 hover:text-red-500">
                                <i class="far fa-heart"></i>
                                <span>${post.likes}</span>
                            </button>
                            <button class="flex items-center space-x-2 hover:text-blue-500">
                                <i class="far fa-comment"></i>
                                <span>0</span>
                            </button>
                            <button class="flex items-center space-x-2 hover:text-green-500">
                                <i class="fas fa-share"></i>
                                <span>Bagikan</span>
                            </button>
                        </div>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading posts:', error);
            }
        }

        // Load stories from server
        async function loadStories() {
            try {
                const response = await fetch('?action=stories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const stories = await response.json();
                
                const container = document.getElementById('stories-container');
                container.innerHTML = stories.map(story => `
                    <div class="flex-shrink-0 text-center cursor-pointer">
                        <div class="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-purple-500 to-pink-500">
                            <img src="${story.avatar}" class="w-full h-full rounded-full border-2 border-white object-cover">
                        </div>
                        <p class="text-sm mt-2">${story.display_name}</p>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading stories:', error);
            }
        }

        // Show create post modal
        function showCreatePost() {
            document.getElementById('createPostModal').classList.remove('hidden');
            document.getElementById('createPostModal').classList.add('flex');
        }

        // Hide create post modal
        function hideCreatePost() {
            document.getElementById('createPostModal').classList.add('hidden');
            document.getElementById('createPostModal').classList.remove('flex');
            document.getElementById('postContent').value = '';
        }

        // Create new post
        async function createPost() {
            const content = document.getElementById('postContent').value.trim();
            if (!content) return;

            try {
                const response = await fetch('?action=create_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                
                if (response.ok) {
                    hideCreatePost();
                    loadPosts(); // Reload posts
                    showNotification('Post berhasil dibuat!');
                }
            } catch (error) {
                console.error('Error creating post:', error);
                showNotification('Gagal membuat post', 'error');
            }
        }

        // Like post
        async function likePost(postId) {
            try {
                const response = await fetch('?action=like_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                });
                
                if (response.ok) {
                    loadPosts(); // Reload posts to show updated likes
                }
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }

        // Show create story (placeholder)
        function showCreateStory() {
            showNotification('Fitur story akan segera hadir!');
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
                type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    </script>
</body>
</html>