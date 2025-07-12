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
    email VARCHAR(100) UNIQUE DEFAULT '',
    password_hash VARCHAR(255) DEFAULT '',
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
    music TEXT DEFAULT '',
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
    $pdo->exec("INSERT INTO users (username, display_name, email, password_hash, avatar, bio, followers, following, posts_count, is_verified) VALUES
        ('andi_jakarta', 'Andi Pratama', 'andi@gmail.com', '". password_hash('password123', PASSWORD_DEFAULT) ."', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Pecinta kopi dan teknologi dari Jakarta', 1250, 890, 45, 1),
        ('sari_bandung', 'Sari Melati', 'sari@gmail.com', '". password_hash('password123', PASSWORD_DEFAULT) ."', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Desainer grafis • Bandung • Cat lover 🐱', 890, 654, 32, 0),
        ('budi_jogja', 'Budi Santoso', 'budi@gmail.com', '". password_hash('password123', PASSWORD_DEFAULT) ."', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Mahasiswa UGM • Fotografer pemula', 567, 423, 28, 0),
        ('maya_bali', 'Maya Sari', 'maya@gmail.com', '". password_hash('password123', PASSWORD_DEFAULT) ."', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Travel blogger • Bali • Beach lover 🏖️', 2340, 1580, 89, 1),
        ('reza_surabaya', 'Reza Ahmad', 'reza@gmail.com', '". password_hash('password123', PASSWORD_DEFAULT) ."', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Mahasiswa ITS • Coding enthusiast', 789, 567, 34, 0)");
    
    $pdo->exec("INSERT INTO posts (user_id, content, likes) VALUES
        (1, 'Hari yang indah untuk ngopi sambil coding! ☕ Ada yang mau join?', 24),
        (2, 'Baru selesai bikin design poster untuk event kampus. Gimana menurut kalian?', 18),
        (3, 'Sunrise di Malioboro pagi ini cantik banget! 🌅', 31),
        (4, 'Pantai Sanur pagi ini eksotis sekali! Perfect untuk foto pre-wedding 📸', 45),
        (5, 'Lagi ngoding project machine learning pakai Python. Seru banget! 🤖', 28)");
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
            $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image, music) VALUES (1, ?, ?, ?)");
            $stmt->execute([
                $input['content'] ?? '',
                $input['image'] ?? '',
                $input['music'] ?? ''
            ]);
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
            
        case 'search_users':
            $input = json_decode(file_get_contents('php://input'), true);
            $query = '%' . $input['query'] . '%';
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username LIKE ? OR display_name LIKE ? OR bio LIKE ? ORDER BY followers DESC");
            $stmt->execute([$query, $query, $query]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;
            
        case 'follow_user':
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE users SET followers = followers + 1 WHERE id = ?");
            $stmt->execute([$input['userId']]);
            echo json_encode(['success' => true]);
            exit;
            
        case 'music_search':
            $input = json_decode(file_get_contents('php://input'), true);
            $query = urlencode($input['query']);
            
            // Mock music data for demonstration
            $musicData = [
                [
                    'id' => 'track1',
                    'name' => 'Daerah',
                    'artist' => 'Payung Teduh',
                    'album' => 'Payung Teduh',
                    'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
                    'preview_url' => 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                ],
                [
                    'id' => 'track2',
                    'name' => 'Akad',
                    'artist' => 'Payung Teduh',
                    'album' => 'Dunia Batas',
                    'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
                    'preview_url' => 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                ],
                [
                    'id' => 'track3',
                    'name' => 'Menunggu Kamu',
                    'artist' => 'Anji',
                    'album' => 'Menunggu Kamu',
                    'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
                    'preview_url' => 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                ]
            ];
            
            $filtered = array_filter($musicData, function($track) use ($input) {
                return stripos($track['name'], $input['query']) !== false || 
                       stripos($track['artist'], $input['query']) !== false;
            });
            
            echo json_encode(array_values($filtered));
            exit;
            
        case 'login':
            $input = json_decode(file_get_contents('php://input'), true);
            $username = $input['username'] ?? '';
            $password = $input['password'] ?? '';
            
            // Check if user exists
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['display_name'] = $user['display_name'];
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Login berhasil',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'display_name' => $user['display_name'],
                        'avatar' => $user['avatar']
                    ]
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Username atau password salah'
                ]);
            }
            exit;

        case 'register':
            $input = json_decode(file_get_contents('php://input'), true);
            $name = $input['name'] ?? '';
            $username = $input['username'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            // Check if username or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Username atau email sudah digunakan'
                ]);
                exit;
            }
            
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new user
            $stmt = $pdo->prepare("INSERT INTO users (username, display_name, email, password_hash, avatar, bio, followers, following, posts_count, is_verified) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0)");
            $defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
            $stmt->execute([$username, $name, $email, $passwordHash, $defaultAvatar, '']);
            
            $userId = $pdo->lastInsertId();
            
            // Auto login after registration
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['display_name'] = $name;
            
            echo json_encode([
                'success' => true,
                'message' => 'Registrasi berhasil',
                'user' => [
                    'id' => $userId,
                    'username' => $username,
                    'display_name' => $name,
                    'avatar' => $defaultAvatar
                ]
            ]);
            exit;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout berhasil']);
            exit;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GenZ Social Media - Complete</title>
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
        
        /* Toggle Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #667eea;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        /* Emoji Picker */
        .emoji-picker {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .emoji {
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: background-color 0.2s;
        }
        
        .emoji:hover {
            background-color: #f3f4f6;
        }
        
        /* Music Search */
        .music-track {
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .music-track:hover {
            background-color: #f3f4f6;
        }
        
        /* Help Center */
        .help-category {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: transform 0.3s ease;
        }
        
        .help-category:hover {
            transform: translateY(-2px);
        }
        
        .faq-item {
            border-bottom: 1px solid #e5e7eb;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .faq-item:hover {
            background-color: #f9fafb;
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .faq-answer.open {
            max-height: 200px;
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

    <!-- Login/Register Page -->
    <div id="authPage" class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800 mb-2">GenZ</h1>
                <p class="text-gray-600">Social Media untuk Generasi Z</p>
            </div>

            <!-- Login Form -->
            <div id="loginForm" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username atau Email</label>
                    <input type="text" id="loginUsername" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Masukkan username atau email">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" id="loginPassword" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Masukkan password">
                </div>
                
                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200">
                        <span class="ml-2 text-sm text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" class="text-sm text-purple-600 hover:text-purple-500">Lupa password?</a>
                </div>
                
                <button onclick="handleLogin()" 
                        class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200">
                    Masuk
                </button>
                
                <div class="text-center">
                    <span class="text-gray-600">Belum punya akun? </span>
                    <button onclick="showRegisterForm()" class="text-purple-600 hover:text-purple-500 font-medium">
                        Daftar sekarang
                    </button>
                </div>
                
                <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-800 font-medium mb-2">Demo Login:</p>
                    <p class="text-xs text-blue-700">Username: <strong>andi_jakarta</strong></p>
                    <p class="text-xs text-blue-700">Password: <strong>password123</strong></p>
                </div>
            </div>

            <!-- Register Form -->
            <div id="registerForm" class="space-y-6 hidden">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                    <input type="text" id="registerName" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Masukkan nama lengkap">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input type="text" id="registerUsername" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Pilih username unik">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" id="registerEmail" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Masukkan email">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input type="password" id="registerPassword" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Minimal 8 karakter">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                    <input type="password" id="registerConfirmPassword" 
                           class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="Ulangi password">
                </div>
                
                <div class="flex items-center">
                    <input type="checkbox" id="agreeTerms" class="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200">
                    <label for="agreeTerms" class="ml-2 text-sm text-gray-600">
                        Saya setuju dengan <a href="#" class="text-purple-600 hover:text-purple-500">Syarat dan Ketentuan</a>
                    </label>
                </div>
                
                <button onclick="handleRegister()" 
                        class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200">
                    Daftar
                </button>
                
                <div class="text-center">
                    <span class="text-gray-600">Sudah punya akun? </span>
                    <button onclick="showLoginForm()" class="text-purple-600 hover:text-purple-500 font-medium">
                        Masuk di sini
                    </button>
                </div>
            </div>
        </div>
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
    </div>

    <!-- Search Page -->
    <div id="searchPage" class="max-w-4xl mx-auto p-4 hidden">
        <div class="mb-6">
            <div class="relative">
                <input type="text" id="searchInput" placeholder="Cari teman..." 
                       class="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <button onclick="searchUsers()" class="absolute right-3 top-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                    Cari
                </button>
            </div>
        </div>
        <div id="searchResults" class="space-y-4">
            <div class="text-center text-gray-500 py-8">Mulai cari teman baru!</div>
        </div>
    </div>

    <!-- Chat Page -->
    <div id="chatPage" class="max-w-4xl mx-auto p-4 hidden">
        <div class="bg-white rounded-lg shadow-md">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold">Chat</h2>
            </div>
            <div class="p-4 space-y-4">
                <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" 
                         class="w-12 h-12 rounded-full mr-3">
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h3 class="font-medium">Sari Melati</h3>
                            <span class="text-sm text-gray-500">10:30</span>
                        </div>
                        <p class="text-sm text-gray-600">Hai, gimana kabarnya?</p>
                    </div>
                </div>
                <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face" 
                         class="w-12 h-12 rounded-full mr-3">
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h3 class="font-medium">Budi Santoso</h3>
                            <span class="text-sm text-gray-500">09:45</span>
                        </div>
                        <p class="text-sm text-gray-600">Foto sunrise tadi keren banget!</p>
                    </div>
                </div>
                <div class="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" 
                         class="w-12 h-12 rounded-full mr-3">
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <h3 class="font-medium">Maya Sari</h3>
                            <span class="text-sm text-gray-500">08:20</span>
                        </div>
                        <p class="text-sm text-gray-600">Pantai Bali memang eksotis!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Page -->
    <div id="profilePage" class="max-w-4xl mx-auto p-4 hidden">
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex items-center mb-6">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                     class="w-20 h-20 rounded-full mr-4">
                <div class="flex-1">
                    <h2 class="text-xl font-bold">Andi Pratama</h2>
                    <p class="text-gray-500">@andi_jakarta</p>
                    <p class="text-gray-700 mt-2">Pecinta kopi dan teknologi dari Jakarta</p>
                </div>
                <button onclick="showAccountManager()" class="bg-purple-600 text-white px-4 py-2 rounded-lg">
                    Edit Profile
                </button>
            </div>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div class="text-xl font-bold">45</div>
                    <div class="text-gray-500 text-sm">Posts</div>
                </div>
                <div>
                    <div class="text-xl font-bold">1,250</div>
                    <div class="text-gray-500 text-sm">Followers</div>
                </div>
                <div>
                    <div class="text-xl font-bold">890</div>
                    <div class="text-gray-500 text-sm">Following</div>
                </div>
            </div>
        </div>
        
        <!-- Profile Posts Grid -->
        <div class="grid grid-cols-3 gap-2">
            <div class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-2xl"></i>
            </div>
            <div class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-2xl"></i>
            </div>
            <div class="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                <i class="fas fa-image text-gray-400 text-2xl"></i>
            </div>
        </div>
    </div>

    <!-- More Page -->
    <div id="morePage" class="max-w-4xl mx-auto p-4 hidden">
        <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-md p-4">
                <h3 class="font-semibold mb-4">Akun</h3>
                <div class="space-y-3">
                    <button onclick="showAccountManager()" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-user-circle text-xl text-gray-600 mr-3"></i>
                            <span>Kelola Akun</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button onclick="showSettings()" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-cog text-xl text-gray-600 mr-3"></i>
                            <span>Pengaturan</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button onclick="showHelpCenter()" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-question-circle text-xl text-gray-600 mr-3"></i>
                            <span>Pusat Bantuan</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button onclick="showAdminPanel()" class="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                            <i class="fas fa-shield-alt text-xl text-gray-600 mr-3"></i>
                            <span>Admin Panel</span>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400"></i>
                    </button>
                    <button onclick="handleLogout()" class="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg text-red-600">
                        <div class="flex items-center">
                            <i class="fas fa-sign-out-alt text-xl mr-3"></i>
                            <span>Logout</span>
                        </div>
                        <i class="fas fa-chevron-right text-red-400"></i>
                    </button>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-4">
                <h3 class="font-semibold mb-4">Tentang</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Versi</span>
                        <span class="font-medium">1.0.0</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Build</span>
                        <span class="font-medium">PHP Complete</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div class="max-w-4xl mx-auto px-4">
            <div class="flex justify-around py-3">
                <button onclick="showPage('home')" class="nav-btn flex flex-col items-center text-purple-600">
                    <i class="fas fa-home text-xl"></i>
                    <span class="text-xs mt-1">Beranda</span>
                </button>
                <button onclick="showPage('search')" class="nav-btn flex flex-col items-center text-gray-500">
                    <i class="fas fa-search text-xl"></i>
                    <span class="text-xs mt-1">Cari</span>
                </button>
                <button onclick="showPage('chat')" class="nav-btn flex flex-col items-center text-gray-500">
                    <i class="fas fa-comment text-xl"></i>
                    <span class="text-xs mt-1">Chat</span>
                </button>
                <button onclick="showPage('profile')" class="nav-btn flex flex-col items-center text-gray-500">
                    <i class="fas fa-user text-xl"></i>
                    <span class="text-xs mt-1">Profil</span>
                </button>
                <button onclick="showPage('more')" class="nav-btn flex flex-col items-center text-gray-500">
                    <i class="fas fa-ellipsis-h text-xl"></i>
                    <span class="text-xs mt-1">Menu</span>
                </button>
            </div>
        </div>
    </nav>

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
            
            <!-- Post Tools -->
            <div class="flex items-center justify-between mt-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex space-x-4">
                    <button onclick="showImageUpload()" class="text-gray-600 hover:text-purple-600">
                        <i class="fas fa-image text-xl"></i>
                    </button>
                    <button onclick="showMusicSearch()" class="text-gray-600 hover:text-purple-600">
                        <i class="fas fa-music text-xl"></i>
                    </button>
                    <button onclick="showEmojiPicker()" class="text-gray-600 hover:text-purple-600">
                        <i class="fas fa-smile text-xl"></i>
                    </button>
                </div>
                <button onclick="createPost()" class="gradient-bg text-white px-6 py-2 rounded-lg font-semibold">
                    Post
                </button>
            </div>
            
            <!-- Selected Music Display -->
            <div id="selectedMusic" class="hidden mt-3 p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-music text-blue-600 mr-2"></i>
                        <div>
                            <div class="font-medium text-sm" id="selectedMusicTitle"></div>
                            <div class="text-xs text-gray-600" id="selectedMusicArtist"></div>
                        </div>
                    </div>
                    <button onclick="removeMusic()" class="text-red-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Music Search Modal -->
    <div id="musicSearchModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Cari Musik</h3>
                <button onclick="hideMusicSearch()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="relative mb-4">
                <input type="text" id="musicSearchInput" placeholder="Cari lagu atau artis..." 
                       class="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500">
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <button onclick="searchMusic()" class="absolute right-3 top-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                    Cari
                </button>
            </div>
            <div id="musicSearchResults" class="space-y-2 max-h-60 overflow-y-auto">
                <div class="text-center text-gray-500 py-8">Mulai cari musik!</div>
            </div>
        </div>
    </div>

    <!-- Emoji Picker Modal -->
    <div id="emojiPickerModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">Pilih Emoji</h3>
                <button onclick="hideEmojiPicker()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Emoji Categories -->
            <div class="flex space-x-2 mb-4 overflow-x-auto">
                <button onclick="showEmojiCategory('faces')" class="emoji-cat-btn px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">
                    😀 Wajah
                </button>
                <button onclick="showEmojiCategory('hearts')" class="emoji-cat-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                    ❤️ Hati
                </button>
                <button onclick="showEmojiCategory('nature')" class="emoji-cat-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                    🌺 Alam
                </button>
                <button onclick="showEmojiCategory('food')" class="emoji-cat-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                    🍕 Makanan
                </button>
                <button onclick="showEmojiCategory('activities')" class="emoji-cat-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                    ⚽ Aktivitas
                </button>
                <button onclick="showEmojiCategory('objects')" class="emoji-cat-btn px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                    📱 Objek
                </button>
            </div>
            
            <!-- Emoji Grid -->
            <div id="emojiGrid" class="emoji-picker grid grid-cols-8 gap-2">
                <!-- Emojis will be populated here -->
            </div>
        </div>
    </div>

    <!-- Account Manager Modal -->
    <div id="accountModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Kelola Akun</h2>
                <button onclick="hideAccountManager()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <!-- Account Tabs -->
            <div class="border-b border-gray-200 mb-6">
                <nav class="flex space-x-8">
                    <button onclick="showAccountTab('profile')" class="account-tab-btn py-2 px-1 border-b-2 border-purple-500 text-purple-600 font-medium">
                        Profil
                    </button>
                    <button onclick="showAccountTab('security')" class="account-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Keamanan
                    </button>
                    <button onclick="showAccountTab('privacy')" class="account-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Privasi
                    </button>
                </nav>
            </div>

            <!-- Profile Tab -->
            <div id="accountProfile" class="account-tab-content">
                <!-- Profile Section -->
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white mb-6">
                    <div class="flex items-center">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" 
                             class="w-20 h-20 rounded-full border-4 border-white mr-4">
                        <div>
                            <h3 class="text-xl font-bold">Andi Pratama</h3>
                            <p class="opacity-90">@andi_jakarta</p>
                            <button class="bg-white text-purple-600 px-4 py-1 rounded-full text-sm font-medium mt-2">
                                Ganti Foto
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Account Forms -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tampilan</label>
                        <input type="text" id="accountDisplayName" value="Andi Pratama" 
                               class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea id="accountBio" rows="3" placeholder="Ceritakan tentang dirimu..." 
                                  class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">Pecinta kopi dan teknologi dari Jakarta</textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value="andi@example.com" disabled
                               class="w-full p-3 border rounded-lg bg-gray-50 text-gray-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                        <input type="text" value="Jakarta, Indonesia" 
                               class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                        <input type="url" placeholder="https://website.com" 
                               class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div class="flex space-x-4">
                        <button onclick="saveProfile()" class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold">
                            Simpan Perubahan
                        </button>
                        <button onclick="hideAccountManager()" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">
                            Batal
                        </button>
                    </div>
                </div>
            </div>

            <!-- Security Tab -->
            <div id="accountSecurity" class="account-tab-content hidden">
                <div class="space-y-6">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium">Autentikasi Dua Faktor</h3>
                                <p class="text-sm text-gray-600">Tingkatkan keamanan akun dengan 2FA</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="twoFactorToggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium">Notifikasi Login</h3>
                                <p class="text-sm text-gray-600">Dapatkan notifikasi saat ada login baru</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="loginNotificationToggle" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="border-t pt-6">
                        <h3 class="font-medium mb-4">Ganti Password</h3>
                        <div class="space-y-4">
                            <input type="password" placeholder="Password lama" 
                                   class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <input type="password" placeholder="Password baru" 
                                   class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <input type="password" placeholder="Konfirmasi password baru" 
                                   class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                            <button class="bg-purple-600 text-white py-2 px-4 rounded-lg">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Privacy Tab -->
            <div id="accountPrivacy" class="account-tab-content hidden">
                <div class="space-y-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium">Akun Privat</h3>
                                <p class="text-sm text-gray-600">Hanya follower yang dapat melihat konten</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="privateAccountToggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium">Tampil di Pencarian</h3>
                                <p class="text-sm text-gray-600">Izinkan orang lain menemukan profil Anda</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" id="searchableToggle" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="border-t pt-6">
                        <h3 class="font-medium mb-4">Kelola Data</h3>
                        <div class="space-y-3">
                            <button class="w-full bg-blue-600 text-white py-3 rounded-lg">
                                Unduh Data Saya
                            </button>
                            <button class="w-full bg-red-600 text-white py-3 rounded-lg">
                                Hapus Akun
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="settingsModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Pengaturan</h2>
                <button onclick="hideSettings()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-6">
                <!-- Language Setting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                    <select id="languageSelect" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="id">🇮🇩 Bahasa Indonesia</option>
                        <option value="en">🇺🇸 English</option>
                        <option value="ms">🇲🇾 Bahasa Melayu</option>
                    </select>
                </div>
                
                <!-- Media Quality -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Kualitas Media</label>
                    <select id="mediaQualitySelect" class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500">
                        <option value="high">Tinggi (HD)</option>
                        <option value="medium">Sedang</option>
                        <option value="low">Rendah</option>
                    </select>
                </div>
                
                <!-- Toggle Settings -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium">Autoplay Video</h3>
                            <p class="text-sm text-gray-600">Putar video secara otomatis</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="autoplayToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium">Mode Hemat Data</h3>
                            <p class="text-sm text-gray-600">Kurangi penggunaan data</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="dataSaverToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium">Notifikasi Suara</h3>
                            <p class="text-sm text-gray-600">Mainkan suara untuk notifikasi</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="soundToggle" checked>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-medium">Mode Gelap</h3>
                            <p class="text-sm text-gray-600">Tema gelap untuk mata</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="darkModeToggle">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                
                <div class="flex space-x-4">
                    <button onclick="saveSettings()" class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold">
                        Simpan
                    </button>
                    <button onclick="hideSettings()" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Help Center Modal -->
    <div id="helpCenterModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">Pusat Bantuan</h2>
                <button onclick="hideHelpCenter()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <!-- Search Bar -->
            <div class="relative mb-8">
                <input type="text" id="helpSearchInput" placeholder="Cari bantuan..." 
                       class="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-purple-500 text-lg">
                <i class="fas fa-search absolute left-4 top-5 text-gray-400"></i>
            </div>

            <!-- Help Categories -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('account')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Akun</h3>
                            <p class="text-sm opacity-90">Profil, login, pendaftaran</p>
                        </div>
                        <i class="fas fa-user-circle text-2xl"></i>
                    </div>
                </div>
                
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('privacy')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Privasi</h3>
                            <p class="text-sm opacity-90">Keamanan, pengaturan</p>
                        </div>
                        <i class="fas fa-shield-alt text-2xl"></i>
                    </div>
                </div>
                
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('posts')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Postingan</h3>
                            <p class="text-sm opacity-90">Berbagi, edit, hapus</p>
                        </div>
                        <i class="fas fa-edit text-2xl"></i>
                    </div>
                </div>
                
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('safety')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Keamanan</h3>
                            <p class="text-sm opacity-90">Laporkan, blokir</p>
                        </div>
                        <i class="fas fa-exclamation-triangle text-2xl"></i>
                    </div>
                </div>
                
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('technical')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Teknis</h3>
                            <p class="text-sm opacity-90">Bug, error, masalah</p>
                        </div>
                        <i class="fas fa-cog text-2xl"></i>
                    </div>
                </div>
                
                <div class="help-category p-6 rounded-lg text-white cursor-pointer" onclick="showHelpCategory('data')">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-semibold">Data</h3>
                            <p class="text-sm opacity-90">Unduh, hapus, ekspor</p>
                        </div>
                        <i class="fas fa-download text-2xl"></i>
                    </div>
                </div>
            </div>

            <!-- FAQ Section -->
            <div id="faqSection" class="space-y-4">
                <h3 class="text-xl font-semibold mb-4">Pertanyaan yang Sering Diajukan</h3>
                <div id="faqContainer" class="space-y-2">
                    <!-- FAQ items will be populated here -->
                </div>
            </div>

            <!-- Contact Support -->
            <div class="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 class="text-lg font-semibold mb-4">Butuh Bantuan Lebih Lanjut?</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button class="flex items-center justify-center p-4 bg-white rounded-lg hover:bg-gray-100">
                        <i class="fas fa-envelope text-purple-600 mr-2"></i>
                        <span>Email Support</span>
                    </button>
                    <button class="flex items-center justify-center p-4 bg-white rounded-lg hover:bg-gray-100">
                        <i class="fas fa-comments text-green-600 mr-2"></i>
                        <span>Live Chat</span>
                    </button>
                    <button class="flex items-center justify-center p-4 bg-white rounded-lg hover:bg-gray-100">
                        <i class="fas fa-phone text-blue-600 mr-2"></i>
                        <span>Telepon</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

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
                    <button onclick="showAdminTab('reports')" class="admin-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Reports
                    </button>
                    <button onclick="showAdminTab('settings')" class="admin-tab-btn py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                        Settings
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
                
                <!-- Activity Chart -->
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold mb-4">Aktivitas Pengguna</h3>
                    <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p class="text-gray-500">Grafik aktivitas akan ditampilkan di sini</p>
                    </div>
                </div>
            </div>

            <!-- Users Tab -->
            <div id="adminUsers" class="admin-tab-content hidden">
                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Manajemen Pengguna</h3>
                    </div>
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
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold">Manajemen Post</h3>
                    </div>
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

            <!-- Reports Tab -->
            <div id="adminReports" class="admin-tab-content hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Laporan & Moderasi</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                            <div>
                                <h4 class="font-medium">Post Dilaporkan</h4>
                                <p class="text-sm text-gray-600">Ada 3 post yang dilaporkan menunggu review</p>
                            </div>
                            <button class="bg-yellow-600 text-white px-4 py-2 rounded-lg">
                                Review
                            </button>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                            <div>
                                <h4 class="font-medium">Spam Detected</h4>
                                <p class="text-sm text-gray-600">Sistem mendeteksi 5 aktivitas spam</p>
                            </div>
                            <button class="bg-red-600 text-white px-4 py-2 rounded-lg">
                                Tindak Lanjut
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Settings Tab -->
            <div id="adminSettings" class="admin-tab-content hidden">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Pengaturan Sistem</h3>
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-medium">Registrasi Pengguna Baru</h4>
                                <p class="text-sm text-gray-600">Izinkan pendaftaran pengguna baru</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-medium">Verifikasi Email</h4>
                                <p class="text-sm text-gray-600">Wajibkan verifikasi email</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-medium">Moderasi Post</h4>
                                <p class="text-sm text-gray-600">Review post sebelum dipublikasikan</p>
                            </div>
                            <label class="switch">
                                <input type="checkbox">
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Global variables
        let selectedMusic = null;
        let currentEmojiCategory = 'faces';
        
        // Emoji data
        const emojis = {
            faces: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'],
            hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️', '💌', '💋', '💍', '💎', '🌹', '🥀', '💐', '🌺', '🌸', '🌼', '🌻', '🌷'],
            nature: ['🌱', '🌿', '🍀', '🌾', '🌵', '🌴', '🌳', '🌲', '🌰', '🌸', '🌼', '🌻', '🌺', '🌹', '🥀', '🌷', '🌙', '🌛', '🌜', '🌚', '🌝', '🌞', '⭐', '🌟', '✨', '💫', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️'],
            food: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🧀'],
            activities: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '🥍', '🏹', '🎣', '🏋️', '🤺', '🤾', '🏌️', '🧘', '🚴', '🏊', '⛷️', '🏂', '🪂', '🏄', '🚣', '🧗', '🤸', '🏇'],
            objects: ['📱', '💻', '🖥️', '⌨️', '🖱️', '🖨️', '📷', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏰', '⏲️', '⏱️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔']
        };

        // FAQ data
        const faqData = [
            {
                id: 1,
                question: "Bagaimana cara membuat akun GenZ Social?",
                answer: "Untuk membuat akun, klik tombol 'Daftar' di halaman utama, masukkan email dan kata sandi yang kuat, kemudian verifikasi email Anda. Setelah verifikasi berhasil, Anda dapat mulai menggunakan GenZ Social.",
                category: "account"
            },
            {
                id: 2,
                question: "Bagaimana cara mengganti foto profil?",
                answer: "Pergi ke halaman Profil, klik foto profil Anda, pilih 'Edit Profil', kemudian klik pada foto profil dan pilih foto baru dari galeri atau ambil foto baru dengan kamera.",
                category: "account"
            },
            {
                id: 3,
                question: "Bagaimana cara mengatur privasi akun?",
                answer: "Buka Menu > Privasi & Keamanan. Di sini Anda dapat mengatur siapa yang dapat melihat profil Anda, mengirim pesan, dan berinteraksi dengan postingan Anda. Anda juga dapat memblokir pengguna tertentu.",
                category: "privacy"
            },
            {
                id: 4,
                question: "Bagaimana cara menghapus postingan?",
                answer: "Pada postingan Anda, klik tombol tiga titik (⋯) di pojok kanan atas, kemudian pilih 'Hapus'. Konfirmasi untuk menghapus postingan secara permanen.",
                category: "posts"
            },
            {
                id: 5,
                question: "Bagaimana cara melaporkan konten yang tidak pantas?",
                answer: "Klik tombol tiga titik (⋯) pada postingan atau profil yang ingin dilaporkan, pilih 'Laporkan', kemudian pilih alasan pelaporan. Tim kami akan meninjau laporan Anda dalam 24 jam.",
                category: "safety"
            },
            {
                id: 6,
                question: "Bagaimana cara mengunduh data saya?",
                answer: "Pergi ke Menu > Unduh Data, kemudian klik 'Minta Unduhan'. Anda akan menerima email dengan link unduhan dalam 2-3 hari kerja. Data akan tersedia untuk diunduh selama 30 hari.",
                category: "data"
            },
            {
                id: 7,
                question: "Mengapa aplikasi berjalan lambat?",
                answer: "Coba tutup aplikasi lain yang berjalan di background, periksa koneksi internet Anda, atau restart aplikasi. Jika masalah berlanjut, hubungi tim support kami.",
                category: "technical"
            },
            {
                id: 8,
                question: "Bagaimana cara mengaktifkan notifikasi?",
                answer: "Buka Pengaturan > Notifikasi, kemudian aktifkan jenis notifikasi yang Anda inginkan. Pastikan juga pengaturan notifikasi di sistem operasi Anda sudah diizinkan.",
                category: "technical"
            }
        ];

        // Splash Screen Control
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                document.getElementById('splashScreen').classList.add('hidden');
                document.getElementById('authPage').classList.remove('hidden');
                loadFAQ();
            }, 2500);
        });

        // Auth Functions
        function showLoginForm() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        }

        function showRegisterForm() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }

        async function handleLogin() {
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            
            if (!username || !password) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }
            
            try {
                const response = await fetch('?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    document.getElementById('authPage').classList.add('hidden');
                    document.getElementById('mainContent').classList.add('visible');
                    
                    // Update header with user info
                    updateUserHeader(result.user);
                    
                    setTimeout(function() {
                        loadPosts();
                        loadStories();
                    }, 300);
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Terjadi kesalahan saat login', 'error');
            }
        }

        async function handleRegister() {
            const name = document.getElementById('registerName').value.trim();
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value.trim();
            const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            if (!name || !username || !email || !password || !confirmPassword) {
                showNotification('Mohon lengkapi semua field!', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Password tidak cocok!', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password minimal 8 karakter!', 'error');
                return;
            }
            
            if (!agreeTerms) {
                showNotification('Mohon setujui syarat dan ketentuan!', 'error');
                return;
            }
            
            try {
                const response = await fetch('?action=register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, username, email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification(result.message, 'success');
                    document.getElementById('authPage').classList.add('hidden');
                    document.getElementById('mainContent').classList.add('visible');
                    
                    // Update header with user info
                    updateUserHeader(result.user);
                    
                    setTimeout(function() {
                        loadPosts();
                        loadStories();
                    }, 300);
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Terjadi kesalahan saat registrasi', 'error');
            }
        }

        function updateUserHeader(user) {
            const avatarImg = document.querySelector('header img');
            if (avatarImg) {
                avatarImg.src = user.avatar;
                avatarImg.alt = user.display_name;
                avatarImg.title = user.display_name;
            }
        }

        async function handleLogout() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                try {
                    const response = await fetch('?action=logout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        showNotification(result.message, 'success');
                        
                        // Hide main content and show auth page
                        document.getElementById('mainContent').classList.remove('visible');
                        document.getElementById('authPage').classList.remove('hidden');
                        
                        // Reset forms
                        document.getElementById('loginUsername').value = '';
                        document.getElementById('loginPassword').value = '';
                        showLoginForm();
                    }
                } catch (error) {
                    showNotification('Terjadi kesalahan saat logout', 'error');
                }
            }
        }

        // Load posts from server
        async function loadPosts() {
            try {
                const response = await fetch('?action=posts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                const posts = await response.json();
                
                const container = document.getElementById('posts-container');
                container.innerHTML = posts.map(post => {
                    let musicHtml = '';
                    if (post.music) {
                        try {
                            const musicData = JSON.parse(post.music);
                            musicHtml = `
                                <div class="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <div class="flex items-center">
                                        <i class="fas fa-music text-blue-600 mr-2"></i>
                                        <div class="flex-1">
                                            <div class="font-medium text-sm">${musicData.name}</div>
                                            <div class="text-xs text-gray-600">${musicData.artist}</div>
                                        </div>
                                        <button onclick="playMusic('${musicData.preview_url || ''}')" class="text-blue-600 hover:text-blue-800">
                                            <i class="fas fa-play"></i>
                                        </button>
                                    </div>
                                </div>
                            `;
                        } catch (e) {
                            // Ignore if music data is malformed
                        }
                    }
                    
                    return `
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
                                <div class="relative">
                                    <button onclick="showPostMenu(${post.id})" class="text-gray-500 hover:text-gray-700">
                                        <i class="fas fa-ellipsis-v"></i>
                                    </button>
                                    <div id="postMenu${post.id}" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                                        <button onclick="copyPostLink(${post.id})" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <i class="fas fa-link mr-2"></i>Copy Link
                                        </button>
                                        <button onclick="reportPost(${post.id})" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <i class="fas fa-flag mr-2"></i>Report
                                        </button>
                                        <button onclick="deletePost(${post.id})" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            <i class="fas fa-trash mr-2"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p class="text-gray-800 mb-4">${post.content}</p>
                            ${post.image ? `<img src="${post.image}" class="w-full rounded-lg mb-4">` : ''}
                            ${musicHtml}
                            <div class="flex items-center justify-between text-gray-500">
                                <button onclick="likePost(${post.id})" class="flex items-center hover:text-red-500">
                                    <i class="fas fa-heart mr-1"></i>
                                    <span id="likes-${post.id}">${post.likes}</span>
                                </button>
                                <button onclick="sharePost(${post.id})" class="flex items-center hover:text-blue-500">
                                    <i class="fas fa-share mr-1"></i>
                                    Share
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
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
                            <img src="${story.avatar}" class="w-full h-full rounded-full border-2 border-white">
                        </div>
                        <p class="text-sm mt-1">${story.display_name}</p>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading stories:', error);
            }
        }

        // Create post
        async function createPost() {
            const content = document.getElementById('postContent').value.trim();
            if (!content && !selectedMusic) {
                alert('Tulis sesuatu atau pilih musik!');
                return;
            }

            try {
                const response = await fetch('?action=create_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content,
                        music: selectedMusic ? JSON.stringify(selectedMusic) : null
                    })
                });
                
                if (response.ok) {
                    document.getElementById('postContent').value = '';
                    selectedMusic = null;
                    document.getElementById('selectedMusic').classList.add('hidden');
                    hideCreatePost();
                    loadPosts();
                    showNotification('Post berhasil dibuat!');
                }
            } catch (error) {
                console.error('Error creating post:', error);
                showNotification('Gagal membuat post!', 'error');
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
                    const likesElement = document.getElementById(`likes-${postId}`);
                    const currentLikes = parseInt(likesElement.textContent);
                    likesElement.textContent = currentLikes + 1;
                }
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }

        // Share post
        function sharePost(postId) {
            showNotification('Link post berhasil disalin!');
        }

        // Show/hide modals
        function showCreatePost() {
            document.getElementById('createPostModal').classList.remove('hidden');
            document.getElementById('createPostModal').classList.add('flex');
        }

        function hideCreatePost() {
            document.getElementById('createPostModal').classList.add('hidden');
            document.getElementById('createPostModal').classList.remove('flex');
        }

        function showMusicSearch() {
            document.getElementById('musicSearchModal').classList.remove('hidden');
            document.getElementById('musicSearchModal').classList.add('flex');
        }

        function hideMusicSearch() {
            document.getElementById('musicSearchModal').classList.add('hidden');
            document.getElementById('musicSearchModal').classList.remove('flex');
        }

        function showEmojiPicker() {
            document.getElementById('emojiPickerModal').classList.remove('hidden');
            document.getElementById('emojiPickerModal').classList.add('flex');
            showEmojiCategory('faces');
        }

        function hideEmojiPicker() {
            document.getElementById('emojiPickerModal').classList.add('hidden');
            document.getElementById('emojiPickerModal').classList.remove('flex');
        }

        function showAccountManager() {
            document.getElementById('accountModal').classList.remove('hidden');
            document.getElementById('accountModal').classList.add('flex');
            showAccountTab('profile');
        }

        function hideAccountManager() {
            document.getElementById('accountModal').classList.add('hidden');
            document.getElementById('accountModal').classList.remove('flex');
        }

        function showSettings() {
            document.getElementById('settingsModal').classList.remove('hidden');
            document.getElementById('settingsModal').classList.add('flex');
        }

        function hideSettings() {
            document.getElementById('settingsModal').classList.add('hidden');
            document.getElementById('settingsModal').classList.remove('flex');
        }

        function showHelpCenter() {
            document.getElementById('helpCenterModal').classList.remove('hidden');
            document.getElementById('helpCenterModal').classList.add('flex');
        }

        function hideHelpCenter() {
            document.getElementById('helpCenterModal').classList.add('hidden');
            document.getElementById('helpCenterModal').classList.remove('flex');
        }

        function showAdminPanel() {
            document.getElementById('adminModal').classList.remove('hidden');
            document.getElementById('adminModal').classList.add('flex');
            showAdminTab('dashboard');
            loadAdminStats();
        }

        function hideAdminPanel() {
            document.getElementById('adminModal').classList.add('hidden');
            document.getElementById('adminModal').classList.remove('flex');
        }

        // Music search
        async function searchMusic() {
            const query = document.getElementById('musicSearchInput').value.trim();
            if (!query) return;

            try {
                const response = await fetch('?action=music_search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const tracks = await response.json();
                
                const container = document.getElementById('musicSearchResults');
                if (tracks.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-500 py-8">Tidak ada hasil ditemukan</div>';
                } else {
                    container.innerHTML = tracks.map(track => `
                        <div class="music-track flex items-center p-3 rounded-lg" onclick="selectMusic('${track.id}', '${track.name}', '${track.artist}', '${track.preview_url}')">
                            <img src="${track.image}" class="w-12 h-12 rounded-lg mr-3">
                            <div class="flex-1">
                                <div class="font-medium">${track.name}</div>
                                <div class="text-sm text-gray-600">${track.artist}</div>
                            </div>
                            <button class="text-purple-600">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Error searching music:', error);
            }
        }

        function selectMusic(id, name, artist, previewUrl) {
            selectedMusic = { id, name, artist, preview_url: previewUrl };
            document.getElementById('selectedMusicTitle').textContent = name;
            document.getElementById('selectedMusicArtist').textContent = artist;
            document.getElementById('selectedMusic').classList.remove('hidden');
            hideMusicSearch();
        }

        function removeMusic() {
            selectedMusic = null;
            document.getElementById('selectedMusic').classList.add('hidden');
        }

        function playMusic(url) {
            if (url) {
                const audio = new Audio(url);
                audio.play();
            } else {
                showNotification('Preview musik tidak tersedia');
            }
        }

        // Emoji picker
        function showEmojiCategory(category) {
            currentEmojiCategory = category;
            
            // Update active button
            document.querySelectorAll('.emoji-cat-btn').forEach(btn => {
                btn.classList.remove('bg-purple-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            event.target.classList.add('bg-purple-600', 'text-white');
            event.target.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Show emojis
            const container = document.getElementById('emojiGrid');
            container.innerHTML = emojis[category].map(emoji => `
                <div class="emoji" onclick="insertEmoji('${emoji}')">${emoji}</div>
            `).join('');
        }

        function insertEmoji(emoji) {
            const textarea = document.getElementById('postContent');
            textarea.value += emoji;
            textarea.focus();
            hideEmojiPicker();
        }

        // Tab management
        function showAccountTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.account-tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Reset all buttons
            document.querySelectorAll('.account-tab-btn').forEach(btn => {
                btn.classList.remove('border-purple-500', 'text-purple-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            
            // Show selected tab
            document.getElementById('account' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.remove('hidden');
            
            // Set active button
            event.target.classList.remove('border-transparent', 'text-gray-500');
            event.target.classList.add('border-purple-500', 'text-purple-600');
        }

        function showAdminTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.admin-tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });
            
            // Reset all buttons
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

        // Page Navigation
        function showPage(page) {
            // Hide all pages
            const homeSection = document.querySelector('.max-w-4xl.mx-auto.p-4:not([id])');
            if (homeSection) homeSection.classList.add('hidden');
            
            const pages = ['searchPage', 'chatPage', 'profilePage', 'morePage'];
            pages.forEach(p => {
                const element = document.getElementById(p);
                if (element) element.classList.add('hidden');
            });

            // Update navigation buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-purple-600');
                btn.classList.add('text-gray-500');
            });

            // Show selected page and update nav
            if (page === 'home') {
                if (homeSection) homeSection.classList.remove('hidden');
            } else {
                document.getElementById(page + 'Page').classList.remove('hidden');
            }
            
            // Update active nav button
            event.target.closest('.nav-btn').classList.add('text-purple-600');
            event.target.closest('.nav-btn').classList.remove('text-gray-500');
        }

        // Search Functions
        async function searchUsers() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) return;

            try {
                const response = await fetch('?action=search_users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const users = await response.json();
                
                const container = document.getElementById('searchResults');
                if (users.length === 0) {
                    container.innerHTML = '<div class="text-center text-gray-500 py-8">Tidak ada hasil ditemukan</div>';
                } else {
                    container.innerHTML = users.map(user => `
                        <div class="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="${user.avatar}" class="w-12 h-12 rounded-full mr-3">
                                <div>
                                    <div class="flex items-center">
                                        <h3 class="font-semibold">${user.display_name}</h3>
                                        ${user.is_verified ? '<i class="fas fa-check-circle text-blue-500 ml-1"></i>' : ''}
                                    </div>
                                    <p class="text-gray-500 text-sm">@${user.username}</p>
                                    <p class="text-gray-600 text-sm">${user.bio}</p>
                                </div>
                            </div>
                            <button onclick="followUser(${user.id})" class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                                Follow
                            </button>
                        </div>
                    `).join('');
                }
            } catch (error) {
                console.error('Error searching users:', error);
            }
        }

        async function followUser(userId) {
            try {
                const response = await fetch('?action=follow_user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                
                if (response.ok) {
                    showNotification('Berhasil follow user!');
                    // Update button to "Following"
                    event.target.textContent = 'Following';
                    event.target.classList.remove('bg-purple-600');
                    event.target.classList.add('bg-gray-400');
                    event.target.disabled = true;
                }
            } catch (error) {
                console.error('Error following user:', error);
            }
        }

        // Admin functions
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

        // Post menu functions
        function showPostMenu(postId) {
            // Hide all other menus
            document.querySelectorAll('[id^="postMenu"]').forEach(menu => {
                menu.classList.add('hidden');
            });
            
            // Show this menu
            document.getElementById(`postMenu${postId}`).classList.remove('hidden');
        }

        function copyPostLink(postId) {
            const link = `${window.location.origin}#post-${postId}`;
            navigator.clipboard.writeText(link).then(() => {
                showNotification('Link post berhasil disalin!');
            });
            
            // Hide menu
            document.getElementById(`postMenu${postId}`).classList.add('hidden');
        }

        function reportPost(postId) {
            if (confirm('Laporkan post ini sebagai konten yang tidak pantas?')) {
                showNotification('Laporan berhasil dikirim! Tim kami akan meninjau dalam 24 jam.');
            }
            
            // Hide menu
            document.getElementById(`postMenu${postId}`).classList.add('hidden');
        }

        // FAQ Functions
        function loadFAQ() {
            const container = document.getElementById('faqContainer');
            container.innerHTML = faqData.map(faq => `
                <div class="faq-item p-4 bg-white rounded-lg" onclick="toggleFAQ(${faq.id})">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium">${faq.question}</h4>
                        <i class="fas fa-chevron-down transition-transform" id="faqIcon${faq.id}"></i>
                    </div>
                    <div class="faq-answer mt-2 text-gray-600" id="faqAnswer${faq.id}">
                        <p>${faq.answer}</p>
                    </div>
                </div>
            `).join('');
        }

        function toggleFAQ(faqId) {
            const answer = document.getElementById(`faqAnswer${faqId}`);
            const icon = document.getElementById(`faqIcon${faqId}`);
            
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                icon.style.transform = 'rotate(0deg)';
            } else {
                // Close all other FAQs
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('open');
                });
                document.querySelectorAll('[id^="faqIcon"]').forEach(ic => {
                    ic.style.transform = 'rotate(0deg)';
                });
                
                // Open this FAQ
                answer.classList.add('open');
                icon.style.transform = 'rotate(180deg)';
            }
        }

        function showHelpCategory(category) {
            const filteredFAQ = faqData.filter(faq => faq.category === category);
            const container = document.getElementById('faqContainer');
            container.innerHTML = filteredFAQ.map(faq => `
                <div class="faq-item p-4 bg-white rounded-lg" onclick="toggleFAQ(${faq.id})">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium">${faq.question}</h4>
                        <i class="fas fa-chevron-down transition-transform" id="faqIcon${faq.id}"></i>
                    </div>
                    <div class="faq-answer mt-2 text-gray-600" id="faqAnswer${faq.id}">
                        <p>${faq.answer}</p>
                    </div>
                </div>
            `).join('');
        }

        // Save functions
        function saveProfile() {
            showNotification('Profil berhasil disimpan!');
        }

        function saveSettings() {
            showNotification('Pengaturan berhasil disimpan!');
        }

        // Notification function
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Close menus when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.relative')) {
                document.querySelectorAll('[id^="postMenu"]').forEach(menu => {
                    menu.classList.add('hidden');
                });
            }
        });

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            // Load saved settings
            const savedSettings = localStorage.getItem('appSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                document.getElementById('languageSelect').value = settings.language || 'id';
                document.getElementById('mediaQualitySelect').value = settings.mediaQuality || 'high';
                document.getElementById('autoplayToggle').checked = settings.autoplayVideos !== false;
                document.getElementById('dataSaverToggle').checked = settings.useDataSaver || false;
                document.getElementById('soundToggle').checked = settings.soundEnabled !== false;
                document.getElementById('darkModeToggle').checked = settings.darkMode || false;
            }
        });
    </script>
</body>
</html>