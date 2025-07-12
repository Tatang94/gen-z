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
            
        case 'admin_stats':
            $totalUsers = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $totalPosts = $pdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
            $verifiedUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE is_verified = 1")->fetchColumn();
            $totalLikes = $pdo->query("SELECT SUM(likes) FROM posts")->fetchColumn();
            
            echo json_encode([
                'totalUsers' => $totalUsers,
                'totalPosts' => $totalPosts,
                'verifiedUsers' => $verifiedUsers,
                'totalLikes' => $totalLikes ?: 0
            ]);
            exit;
            
        case 'admin_users':
            $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
            
        case 'admin_delete_user':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$input['userId']]);
            echo json_encode(['success' => true]);
            exit;
            
        case 'admin_delete_post':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
            $stmt->execute([$input['postId']]);
            echo json_encode(['success' => true]);
            exit;
            
        case 'admin_verify_user':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
            $stmt->execute([$input['userId']]);
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
        
        /* Splash Screen Styles */
        .splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
        }
        
        .splash-screen.hidden {
            opacity: 0;
            visibility: hidden;
        }
        
        .splash-logo {
            font-size: 4rem;
            font-weight: bold;
            color: white;
            margin-bottom: 1rem;
            animation: bounce 2s infinite;
        }
        
        .splash-tagline {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.2rem;
            margin-bottom: 2rem;
            text-align: center;
            animation: fadeInUp 1s ease-out 0.5s both;
        }
        
        .splash-loader {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .main-content {
            opacity: 0;
            transition: opacity 0.5s ease-in;
        }
        
        .main-content.visible {
            opacity: 1;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Splash Screen -->
    <div id="splashScreen" class="splash-screen">
        <div class="splash-logo">GenZ</div>
        <div class="splash-tagline">
            Social Media untuk Generasi Z<br>
            <span style="font-size: 1rem; opacity: 0.7;">Connecting Indonesia</span>
        </div>
        <div class="splash-loader"></div>
    </div>

    <!-- Main Content -->
    <div id="mainContent" class="main-content">
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
                <button onclick="showAdminPanel()" class="flex flex-col items-center text-gray-500">
                    <i class="fas fa-cog text-xl"></i>
                    <span class="text-xs mt-1">Admin</span>
                </button>
            </div>
        </div>
    </nav>

    <!-- Admin Panel Modal -->
    <div id="adminModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
                <button onclick="hideAdminPanel()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <!-- Admin Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="flex space-x-8">
                    <button onclick="showAdminTab('dashboard')" class="admin-tab-btn py-2 px-1 border-b-2 border-purple-500 text-purple-600 font-medium">
                        Dashboard
                    </button>
                    <button onclick="showAdminTab('users')" class="admin-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Users
                    </button>
                    <button onclick="showAdminTab('posts')" class="admin-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Posts
                    </button>
                </nav>
            </div>

            <!-- Dashboard Tab -->
            <div id="adminDashboard" class="admin-tab-content">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-blue-100">Total Users</p>
                                <p id="totalUsers" class="text-3xl font-bold">-</p>
                            </div>
                            <i class="fas fa-users text-3xl text-blue-200"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-green-100">Total Posts</p>
                                <p id="totalPosts" class="text-3xl font-bold">-</p>
                            </div>
                            <i class="fas fa-edit text-3xl text-green-200"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-purple-100">Verified Users</p>
                                <p id="verifiedUsers" class="text-3xl font-bold">-</p>
                            </div>
                            <i class="fas fa-check-circle text-3xl text-purple-200"></i>
                        </div>
                    </div>
                    <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-red-100">Total Likes</p>
                                <p id="totalLikes" class="text-3xl font-bold">-</p>
                            </div>
                            <i class="fas fa-heart text-3xl text-red-200"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Tab -->
            <div id="adminUsers" class="admin-tab-content hidden">
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Posts Tab -->
            <div id="adminPosts" class="admin-tab-content hidden">
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="postsTableBody" class="bg-white divide-y divide-gray-200">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    </div> <!-- End Main Content -->

    <script>
        // Splash Screen Control
        document.addEventListener('DOMContentLoaded', function() {
            // Show splash screen for 2.5 seconds
            setTimeout(function() {
                document.getElementById('splashScreen').classList.add('hidden');
                document.getElementById('mainContent').classList.add('visible');
                
                // Load data after splash screen
                setTimeout(function() {
                    loadPosts();
                    loadStories();
                }, 300);
            }, 2500);
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

        // Admin Panel Functions
        function showAdminPanel() {
            document.getElementById('adminModal').classList.remove('hidden');
            document.getElementById('adminModal').classList.add('flex');
            loadAdminStats();
        }

        function hideAdminPanel() {
            document.getElementById('adminModal').classList.add('hidden');
            document.getElementById('adminModal').classList.remove('flex');
        }

        function showAdminTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.admin-tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Remove active state from all buttons
            document.querySelectorAll('.admin-tab-btn').forEach(btn => {
                btn.classList.remove('border-purple-500', 'text-purple-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Show selected tab
            document.getElementById('admin' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.remove('hidden');
            
            // Set active button
            event.target.classList.remove('border-transparent', 'text-gray-500');
            event.target.classList.add('border-purple-500', 'text-purple-600');
            
            // Load data for specific tabs
            if (tabName === 'users') {
                loadAdminUsers();
            } else if (tabName === 'posts') {
                loadAdminPosts();
            }
        }

        async function loadAdminStats() {
            try {
                const response = await fetch('?action=admin_stats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const stats = await response.json();
                
                document.getElementById('totalUsers').textContent = stats.totalUsers;
                document.getElementById('totalPosts').textContent = stats.totalPosts;
                document.getElementById('verifiedUsers').textContent = stats.verifiedUsers;
                document.getElementById('totalLikes').textContent = stats.totalLikes;
            } catch (error) {
                console.error('Error loading admin stats:', error);
            }
        }

        async function loadAdminUsers() {
            try {
                const response = await fetch('?action=admin_users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const users = await response.json();
                
                const tbody = document.getElementById('usersTableBody');
                tbody.innerHTML = users.map(user => `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img src="${user.avatar}" class="w-10 h-10 rounded-full mr-3">
                                <div>
                                    <div class="text-sm font-medium text-gray-900">${user.display_name}</div>
                                    <div class="text-sm text-gray-500">@${user.username}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>Followers: ${user.followers}</div>
                            <div>Posts: ${user.posts_count}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }">
                                ${user.is_verified ? 'Verified' : 'Regular'}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ${!user.is_verified ? `<button onclick="verifyUser(${user.id})" class="text-green-600 hover:text-green-900 mr-2">Verify</button>` : ''}
                            <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error loading admin users:', error);
            }
        }

        async function loadAdminPosts() {
            try {
                const response = await fetch('?action=posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const posts = await response.json();
                
                const tbody = document.getElementById('postsTableBody');
                tbody.innerHTML = posts.map(post => `
                    <tr>
                        <td class="px-6 py-4">
                            <div class="text-sm text-gray-900">${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}</div>
                            <div class="text-sm text-gray-500">${new Date(post.created_at).toLocaleDateString()}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <img src="${post.avatar}" class="w-8 h-8 rounded-full mr-2">
                                <div class="text-sm text-gray-900">${post.display_name}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>${post.likes} likes</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="deletePost(${post.id})" class="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                    </tr>
                `).join('');
            } catch (error) {
                console.error('Error loading admin posts:', error);
            }
        }

        async function verifyUser(userId) {
            if (!confirm('Verifikasi user ini?')) return;
            
            try {
                const response = await fetch('?action=admin_verify_user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                
                if (response.ok) {
                    showNotification('User berhasil diverifikasi!');
                    loadAdminUsers();
                    loadAdminStats();
                }
            } catch (error) {
                console.error('Error verifying user:', error);
            }
        }

        async function deleteUser(userId) {
            if (!confirm('Hapus user ini? Tindakan ini tidak dapat dibatalkan.')) return;
            
            try {
                const response = await fetch('?action=admin_delete_user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                
                if (response.ok) {
                    showNotification('User berhasil dihapus!');
                    loadAdminUsers();
                    loadAdminStats();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }

        async function deletePost(postId) {
            if (!confirm('Hapus post ini? Tindakan ini tidak dapat dibatalkan.')) return;
            
            try {
                const response = await fetch('?action=admin_delete_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                });
                
                if (response.ok) {
                    showNotification('Post berhasil dihapus!');
                    loadAdminPosts();
                    loadAdminStats();
                    loadPosts(); // Refresh main feed
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
    </script>
</body>
</html>