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
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
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
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255) DEFAULT '',
    music TEXT DEFAULT '',
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
)");

// Clean database - no demo data
$pdo->exec("DELETE FROM users");
$pdo->exec("DELETE FROM posts");
$pdo->exec("DELETE FROM stories");
$pdo->exec("DELETE FROM comments");

// API Handler
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action'])) {
    header('Content-Type: application/json');
    
    switch ($_GET['action']) {
        case 'register':
            $input = json_decode(file_get_contents('php://input'), true);
            $name = trim($input['name'] ?? '');
            $username = trim($input['username'] ?? '');
            $email = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';
            
            // Validation
            if (empty($name) || empty($username) || empty($email) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Semua field harus diisi']);
                exit;
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
                exit;
            }
            
            if (strlen($password) < 6) {
                echo json_encode(['success' => false, 'message' => 'Password minimal 6 karakter']);
                exit;
            }
            
            // Check if username or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                echo json_encode(['success' => false, 'message' => 'Username atau email sudah digunakan']);
                exit;
            }
            
            // Hash password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Insert new user
            $stmt = $pdo->prepare("INSERT INTO users (username, display_name, email, password_hash, avatar, bio) VALUES (?, ?, ?, ?, ?, ?)");
            $defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
            $stmt->execute([$username, $name, $email, $passwordHash, $defaultAvatar, '']);
            
            $userId = $pdo->lastInsertId();
            
            // Auto login after registration
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['display_name'] = $name;
            
            echo json_encode([
                'success' => true,
                'message' => 'Registrasi berhasil! Selamat datang di GenZ Social Media',
                'user' => [
                    'id' => $userId,
                    'username' => $username,
                    'display_name' => $name,
                    'avatar' => $defaultAvatar
                ]
            ]);
            exit;

        case 'login':
            $input = json_decode(file_get_contents('php://input'), true);
            $username = trim($input['username'] ?? '');
            $password = $input['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                echo json_encode(['success' => false, 'message' => 'Username dan password harus diisi']);
                exit;
            }
            
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
                echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
            }
            exit;

        case 'logout':
            session_destroy();
            echo json_encode(['success' => true, 'message' => 'Logout berhasil']);
            exit;

        case 'posts':
            $stmt = $pdo->query("
                SELECT p.*, u.username, u.display_name, u.avatar, u.is_verified 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC
            ");
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Parse music data if exists
            foreach ($posts as &$post) {
                if (!empty($post['music'])) {
                    $post['music'] = json_decode($post['music'], true);
                }
            }
            
            echo json_encode($posts);
            exit;
            
        case 'create_post':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $userId = $_SESSION['user_id'];
            
            $content = trim($input['content'] ?? '');
            $image = $input['image'] ?? '';
            $music = $input['music'] ?? '';
            
            // Validate - at least one content type must be provided
            if (empty($content) && empty($image) && empty($music)) {
                echo json_encode(['success' => false, 'message' => 'Post tidak boleh kosong']);
                exit;
            }
            
            // Convert music to JSON if provided
            $musicJson = '';
            if (!empty($music)) {
                $musicJson = json_encode($music);
            }
            
            $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image, music) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $content, $image, $musicJson]);
            
            // Update user's post count
            $pdo->prepare("UPDATE users SET posts_count = posts_count + 1 WHERE id = ?")->execute([$userId]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Post berhasil dibuat']);
            exit;
            
        case 'upload_image':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            if (!isset($_FILES['image'])) {
                echo json_encode(['success' => false, 'message' => 'Tidak ada file yang dipilih']);
                exit;
            }
            
            $file = $_FILES['image'];
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            
            if (!in_array($file['type'], $allowedTypes)) {
                echo json_encode(['success' => false, 'message' => 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP']);
                exit;
            }
            
            if ($file['size'] > 5 * 1024 * 1024) { // 5MB
                echo json_encode(['success' => false, 'message' => 'Ukuran file terlalu besar (maksimal 5MB)']);
                exit;
            }
            
            // Create uploads directory if not exists
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid() . '.' . $extension;
            $filePath = $uploadDir . $fileName;
            
            if (move_uploaded_file($file['tmp_name'], $filePath)) {
                echo json_encode(['success' => true, 'url' => $filePath]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Gagal mengupload file']);
            }
            exit;
            
        case 'like_post':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $postId = $input['postId'] ?? 0;
            
            $stmt = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?");
            $stmt->execute([$postId]);
            
            // Get updated likes count
            $stmt = $pdo->prepare("SELECT likes FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            $likes = $stmt->fetchColumn();
            
            echo json_encode(['success' => true, 'likes' => $likes]);
            exit;
            
        case 'delete_post':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $postId = $input['postId'] ?? 0;
            $userId = $_SESSION['user_id'];
            
            // Check if user owns the post
            $stmt = $pdo->prepare("SELECT user_id FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            $post = $stmt->fetch();
            
            if ($post && $post['user_id'] == $userId) {
                $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
                $stmt->execute([$postId]);
                
                // Update user's post count
                $pdo->prepare("UPDATE users SET posts_count = posts_count - 1 WHERE id = ?")->execute([$userId]);
                
                echo json_encode(['success' => true, 'message' => 'Post berhasil dihapus']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Tidak memiliki izin untuk menghapus post ini']);
            }
            exit;

        case 'music_search':
            $input = json_decode(file_get_contents('php://input'), true);
            $query = trim($input['query'] ?? '');
            
            if (empty($query)) {
                echo json_encode([]);
                exit;
            }
            
            // Real music search using iTunes API
            $apiUrl = "https://itunes.apple.com/search?term=" . urlencode($query) . "&media=music&limit=20";
            $response = @file_get_contents($apiUrl);
            
            if ($response === false) {
                // Fallback to mock data if API fails
                $musicData = [
                    [
                        'id' => 'track1',
                        'name' => 'Daerah',
                        'artist' => 'Payung Teduh',
                        'album' => 'Payung Teduh',
                        'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
                        'preview_url' => ''
                    ],
                    [
                        'id' => 'track2',
                        'name' => 'Akad',
                        'artist' => 'Payung Teduh',
                        'album' => 'Dunia Batas',
                        'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
                        'preview_url' => ''
                    ]
                ];
                
                $filtered = array_filter($musicData, function($track) use ($query) {
                    return stripos($track['name'], $query) !== false || 
                           stripos($track['artist'], $query) !== false;
                });
                
                echo json_encode(array_values($filtered));
            } else {
                $data = json_decode($response, true);
                $tracks = [];
                
                if (isset($data['results'])) {
                    foreach ($data['results'] as $track) {
                        $tracks[] = [
                            'id' => $track['trackId'] ?? uniqid(),
                            'name' => $track['trackName'] ?? 'Unknown',
                            'artist' => $track['artistName'] ?? 'Unknown Artist',
                            'album' => $track['collectionName'] ?? 'Unknown Album',
                            'image' => str_replace('100x100', '150x150', $track['artworkUrl100'] ?? ''),
                            'preview_url' => $track['previewUrl'] ?? ''
                        ];
                    }
                }
                
                echo json_encode($tracks);
            }
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

        case 'search_users':
            $input = json_decode(file_get_contents('php://input'), true);
            $query = '%' . trim($input['query'] ?? '') . '%';
            
            if (empty(trim($input['query'] ?? ''))) {
                echo json_encode([]);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username LIKE ? OR display_name LIKE ? OR bio LIKE ? ORDER BY followers DESC LIMIT 20");
            $stmt->execute([$query, $query, $query]);
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit;

        case 'follow_user':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $stmt = $pdo->prepare("UPDATE users SET followers = followers + 1 WHERE id = ?");
            $stmt->execute([$input['userId']]);
            echo json_encode(['success' => true]);
            exit;

        case 'get_profile':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'message' => 'Silakan login terlebih dahulu']);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['user_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
            }
            exit;

        default:
            echo json_encode(['success' => false, 'message' => 'Action tidak dikenal']);
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
        
        /* Splash Screen */
        .splash-screen {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 9999; transition: opacity 0.8s ease-out, visibility 0.8s ease-out;
        }
        .splash-screen.hidden { opacity: 0; visibility: hidden; }
        .splash-logo {
            font-size: 4rem; font-weight: bold; color: white; margin-bottom: 1rem;
            animation: bounce 2s infinite;
        }
        .splash-tagline {
            color: rgba(255, 255, 255, 0.8); font-size: 1.2rem; margin-bottom: 2rem;
            text-align: center; animation: fadeInUp 1s ease-out 0.5s both;
        }
        .splash-loader {
            width: 50px; height: 50px; border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .main-content { opacity: 0; transition: opacity 0.5s ease-in; }
        .main-content.visible { opacity: 1; }
        
        /* Emoji styles */
        .emoji { font-size: 1.5rem; cursor: pointer; padding: 0.25rem; border-radius: 0.25rem; }
        .emoji:hover { background-color: #f3f4f6; }
        
        /* Audio player styles */
        .audio-player {
            display: flex; align-items: center; gap: 0.5rem;
            background: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; margin-top: 0.5rem;
        }
        .play-btn {
            width: 40px; height: 40px; border-radius: 50%; background: #667eea;
            color: white; border: none; cursor: pointer; display: flex;
            align-items: center; justify-content: center;
        }
        .play-btn:hover { background: #5a67d8; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Splash Screen -->
    <div id="splashScreen" class="splash-screen">
        <div class="splash-logo">GenZ</div>
        <div class="splash-tagline">Terhubung dengan Generasi Z<br>Platform Media Sosial Terbaru</div>
        <div class="splash-loader"></div>
    </div>

    <!-- Main Content -->
    <div id="mainContent" class="main-content">
        <!-- Auth Screen -->
        <div id="authScreen" class="min-h-screen gradient-bg flex items-center justify-center px-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div class="text-center mb-8">
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">GenZ</h1>
                    <p class="text-gray-600">Bergabunglah dengan komunitas GenZ</p>
                </div>

                <!-- Login Form -->
                <div id="loginForm">
                    <h2 class="text-2xl font-semibold text-center mb-6">Masuk</h2>
                    <form id="loginFormElement">
                        <div class="mb-4">
                            <input type="text" id="loginUsername" placeholder="Username atau Email" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <div class="mb-6">
                            <input type="password" id="loginPassword" placeholder="Password" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <button type="submit" class="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">
                            Masuk
                        </button>
                    </form>
                    <p class="text-center mt-4 text-gray-600">
                        Belum punya akun? 
                        <button onclick="showRegisterForm()" class="text-blue-500 hover:underline">Daftar di sini</button>
                    </p>
                </div>

                <!-- Register Form -->
                <div id="registerForm" class="hidden">
                    <h2 class="text-2xl font-semibold text-center mb-6">Daftar</h2>
                    <form id="registerFormElement">
                        <div class="mb-4">
                            <input type="text" id="registerName" placeholder="Nama Lengkap" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <div class="mb-4">
                            <input type="text" id="registerUsername" placeholder="Username" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <div class="mb-4">
                            <input type="email" id="registerEmail" placeholder="Email" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <div class="mb-6">
                            <input type="password" id="registerPassword" placeholder="Password (min. 6 karakter)" 
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        </div>
                        <button type="submit" class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200">
                            Daftar
                        </button>
                    </form>
                    <p class="text-center mt-4 text-gray-600">
                        Sudah punya akun? 
                        <button onclick="showLoginForm()" class="text-blue-500 hover:underline">Masuk di sini</button>
                    </p>
                </div>
            </div>
        </div>

        <!-- Main App -->
        <div id="mainApp" class="hidden min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white shadow-sm sticky top-0 z-40">
                <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <h1 class="text-2xl font-bold gradient-bg bg-clip-text text-transparent">GenZ</h1>
                    <div class="flex items-center space-x-4">
                        <span id="currentUserName" class="text-gray-700"></span>
                        <button onclick="logout()" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </header>

            <!-- Main Container -->
            <div class="max-w-4xl mx-auto px-4 py-6">
                <!-- Create Post -->
                <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div class="flex items-start space-x-3">
                        <img id="userAvatar" src="" alt="Avatar" class="w-10 h-10 rounded-full">
                        <div class="flex-1">
                            <textarea id="postContent" placeholder="Apa yang sedang kamu pikirkan?" 
                                      class="w-full border-none resize-none focus:outline-none text-lg" rows="3"></textarea>
                            
                            <!-- Image Preview -->
                            <div id="imagePreview" class="hidden mt-3">
                                <img id="previewImg" src="" alt="Preview" class="max-w-full h-auto rounded-lg">
                                <button onclick="removeImage()" class="mt-2 text-red-500 hover:text-red-700">
                                    <i class="fas fa-times"></i> Hapus gambar
                                </button>
                            </div>

                            <!-- Music Preview -->
                            <div id="musicPreview" class="hidden mt-3">
                                <div class="bg-blue-50 p-3 rounded-lg flex items-center space-x-3">
                                    <img id="musicImage" src="" alt="Album" class="w-12 h-12 rounded">
                                    <div>
                                        <p id="musicTitle" class="font-semibold"></p>
                                        <p id="musicArtist" class="text-gray-600 text-sm"></p>
                                    </div>
                                    <button onclick="removeMusic()" class="ml-auto text-red-500 hover:text-red-700">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="flex items-center justify-between mt-4 pt-3 border-t">
                                <div class="flex space-x-4">
                                    <label for="imageUpload" class="text-blue-500 hover:text-blue-700 cursor-pointer">
                                        <i class="fas fa-image"></i> Foto
                                    </label>
                                    <input type="file" id="imageUpload" accept="image/*" class="hidden">
                                    
                                    <button onclick="showMusicSearch()" class="text-green-500 hover:text-green-700">
                                        <i class="fas fa-music"></i> Musik
                                    </button>
                                    
                                    <button onclick="showEmojiPicker()" class="text-yellow-500 hover:text-yellow-700">
                                        <i class="fas fa-smile"></i> Emoji
                                    </button>
                                </div>
                                <button onclick="createPost()" class="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600">
                                    Posting
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Posts Feed -->
                <div id="postsContainer">
                    <div class="text-center py-12">
                        <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">Belum ada postingan</h3>
                        <p class="text-gray-500">Jadilah yang pertama membuat postingan!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Music Search Modal -->
    <div id="musicSearchModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full max-h-96 overflow-hidden">
            <div class="p-4 border-b">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Cari Musik</h3>
                    <button onclick="closeMusicSearch()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <input type="text" id="musicSearchInput" placeholder="Cari lagu atau artis..." 
                       class="w-full mt-3 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div id="musicSearchResults" class="p-4 max-h-64 overflow-y-auto">
                <p class="text-gray-500 text-center">Ketik untuk mencari musik...</p>
            </div>
        </div>
    </div>

    <!-- Emoji Picker Modal -->
    <div id="emojiPickerModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg max-w-md w-full">
            <div class="p-4 border-b">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Pilih Emoji</h3>
                    <button onclick="closeEmojiPicker()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="p-4 max-h-64 overflow-y-auto">
                <div class="grid grid-cols-8 gap-2">
                    <!-- Common emojis -->
                    <span class="emoji" onclick="addEmoji('😀')">😀</span>
                    <span class="emoji" onclick="addEmoji('😃')">😃</span>
                    <span class="emoji" onclick="addEmoji('😄')">😄</span>
                    <span class="emoji" onclick="addEmoji('😁')">😁</span>
                    <span class="emoji" onclick="addEmoji('😆')">😆</span>
                    <span class="emoji" onclick="addEmoji('😅')">😅</span>
                    <span class="emoji" onclick="addEmoji('🤣')">🤣</span>
                    <span class="emoji" onclick="addEmoji('😂')">😂</span>
                    <span class="emoji" onclick="addEmoji('🙂')">🙂</span>
                    <span class="emoji" onclick="addEmoji('🙃')">🙃</span>
                    <span class="emoji" onclick="addEmoji('😉')">😉</span>
                    <span class="emoji" onclick="addEmoji('😊')">😊</span>
                    <span class="emoji" onclick="addEmoji('😇')">😇</span>
                    <span class="emoji" onclick="addEmoji('🥰')">🥰</span>
                    <span class="emoji" onclick="addEmoji('😍')">😍</span>
                    <span class="emoji" onclick="addEmoji('🤩')">🤩</span>
                    <span class="emoji" onclick="addEmoji('😘')">😘</span>
                    <span class="emoji" onclick="addEmoji('😗')">😗</span>
                    <span class="emoji" onclick="addEmoji('😚')">😚</span>
                    <span class="emoji" onclick="addEmoji('😙')">😙</span>
                    <span class="emoji" onclick="addEmoji('😋')">😋</span>
                    <span class="emoji" onclick="addEmoji('😛')">😛</span>
                    <span class="emoji" onclick="addEmoji('😜')">😜</span>
                    <span class="emoji" onclick="addEmoji('🤪')">🤪</span>
                    <span class="emoji" onclick="addEmoji('😝')">😝</span>
                    <span class="emoji" onclick="addEmoji('🤑')">🤑</span>
                    <span class="emoji" onclick="addEmoji('🤗')">🤗</span>
                    <span class="emoji" onclick="addEmoji('🤭')">🤭</span>
                    <span class="emoji" onclick="addEmoji('🤫')">🤫</span>
                    <span class="emoji" onclick="addEmoji('🤔')">🤔</span>
                    <span class="emoji" onclick="addEmoji('🤐')">🤐</span>
                    <span class="emoji" onclick="addEmoji('🤨')">🤨</span>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentUser = null;
        let selectedImage = null;
        let selectedMusic = null;

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                document.getElementById('splashScreen').classList.add('hidden');
                document.getElementById('mainContent').classList.add('visible');
            }, 3000);

            // Setup event listeners
            document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
            document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
            document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
            document.getElementById('musicSearchInput').addEventListener('input', searchMusic);
        });

        function showRegisterForm() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }

        function showLoginForm() {
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        }

        async function handleLogin(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('?action=login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const result = await response.json();
                if (result.success) {
                    currentUser = result.user;
                    showMainApp();
                    showToast(result.message, 'success');
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Terjadi kesalahan saat login', 'error');
            }
        }

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('?action=register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, username, email, password })
                });

                const result = await response.json();
                if (result.success) {
                    currentUser = result.user;
                    showMainApp();
                    showToast(result.message, 'success');
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Terjadi kesalahan saat registrasi', 'error');
            }
        }

        function showMainApp() {
            document.getElementById('authScreen').classList.add('hidden');
            document.getElementById('mainApp').classList.remove('hidden');
            document.getElementById('currentUserName').textContent = currentUser.display_name;
            document.getElementById('userAvatar').src = currentUser.avatar;
            loadPosts();
        }

        async function logout() {
            if (confirm('Yakin ingin logout?')) {
                await fetch('?action=logout', { method: 'POST' });
                location.reload();
            }
        }

        async function loadPosts() {
            try {
                const response = await fetch('?action=posts', { method: 'POST' });
                const posts = await response.json();
                displayPosts(posts);
            } catch (error) {
                console.error('Error loading posts:', error);
            }
        }

        function displayPosts(posts) {
            const container = document.getElementById('postsContainer');
            
            if (posts.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-comments text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">Belum ada postingan</h3>
                        <p class="text-gray-500">Jadilah yang pertama membuat postingan!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = posts.map(post => {
                let mediaContent = '';
                
                if (post.image) {
                    mediaContent = `<img src="${post.image}" alt="Post image" class="w-full h-auto rounded-lg mt-3">`;
                }
                
                if (post.music) {
                    const music = typeof post.music === 'string' ? JSON.parse(post.music) : post.music;
                    mediaContent += `
                        <div class="audio-player">
                            <button class="play-btn" onclick="toggleAudio('audio_${post.id}')">
                                <i class="fas fa-play" id="icon_${post.id}"></i>
                            </button>
                            <div>
                                <p class="font-semibold text-sm">${music.name}</p>
                                <p class="text-gray-600 text-xs">${music.artist}</p>
                            </div>
                            ${music.preview_url ? `<audio id="audio_${post.id}" src="${music.preview_url}" preload="none"></audio>` : ''}
                        </div>
                    `;
                }

                return `
                    <div class="bg-white rounded-lg shadow-sm p-6 mb-4">
                        <div class="flex items-start space-x-3">
                            <img src="${post.avatar}" alt="${post.display_name}" class="w-10 h-10 rounded-full">
                            <div class="flex-1">
                                <div class="flex items-center space-x-2">
                                    <h4 class="font-semibold">${post.display_name}</h4>
                                    ${post.is_verified ? '<i class="fas fa-check-circle text-blue-500 text-sm"></i>' : ''}
                                    <span class="text-gray-500 text-sm">@${post.username}</span>
                                    <span class="text-gray-400 text-sm">• ${new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                                </div>
                                ${post.content ? `<p class="mt-2 text-gray-800">${post.content}</p>` : ''}
                                ${mediaContent}
                                <div class="flex items-center space-x-6 mt-4 pt-3 border-t">
                                    <button onclick="likePost(${post.id})" class="flex items-center space-x-2 text-gray-500 hover:text-red-500">
                                        <i class="far fa-heart"></i>
                                        <span id="likes_${post.id}">${post.likes}</span>
                                    </button>
                                    <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                                        <i class="far fa-comment"></i>
                                        <span>Komentar</span>
                                    </button>
                                    <button class="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                                        <i class="far fa-share"></i>
                                        <span>Bagikan</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        async function createPost() {
            const content = document.getElementById('postContent').value.trim();
            
            if (!content && !selectedImage && !selectedMusic) {
                showToast('Post tidak boleh kosong', 'error');
                return;
            }

            try {
                const response = await fetch('?action=create_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: content,
                        image: selectedImage || '',
                        music: selectedMusic || ''
                    })
                });

                const result = await response.json();
                if (result.success) {
                    document.getElementById('postContent').value = '';
                    selectedImage = null;
                    selectedMusic = null;
                    document.getElementById('imagePreview').classList.add('hidden');
                    document.getElementById('musicPreview').classList.add('hidden');
                    loadPosts();
                    showToast(result.message, 'success');
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Terjadi kesalahan saat membuat post', 'error');
            }
        }

        async function handleImageUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('?action=upload_image', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.success) {
                    selectedImage = result.url;
                    document.getElementById('previewImg').src = result.url;
                    document.getElementById('imagePreview').classList.remove('hidden');
                } else {
                    showToast(result.message, 'error');
                }
            } catch (error) {
                showToast('Gagal mengupload gambar', 'error');
            }
        }

        function removeImage() {
            selectedImage = null;
            document.getElementById('imagePreview').classList.add('hidden');
            document.getElementById('imageUpload').value = '';
        }

        function removeMusic() {
            selectedMusic = null;
            document.getElementById('musicPreview').classList.add('hidden');
        }

        function showMusicSearch() {
            document.getElementById('musicSearchModal').classList.remove('hidden');
        }

        function closeMusicSearch() {
            document.getElementById('musicSearchModal').classList.add('hidden');
            document.getElementById('musicSearchInput').value = '';
            document.getElementById('musicSearchResults').innerHTML = '<p class="text-gray-500 text-center">Ketik untuk mencari musik...</p>';
        }

        async function searchMusic() {
            const query = document.getElementById('musicSearchInput').value.trim();
            if (!query) {
                document.getElementById('musicSearchResults').innerHTML = '<p class="text-gray-500 text-center">Ketik untuk mencari musik...</p>';
                return;
            }

            try {
                const response = await fetch('?action=music_search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const tracks = await response.json();
                displayMusicResults(tracks);
            } catch (error) {
                document.getElementById('musicSearchResults').innerHTML = '<p class="text-red-500 text-center">Gagal mencari musik</p>';
            }
        }

        function displayMusicResults(tracks) {
            const container = document.getElementById('musicSearchResults');
            
            if (tracks.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center">Tidak ada hasil ditemukan</p>';
                return;
            }

            container.innerHTML = tracks.map(track => `
                <div class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer" onclick="selectMusic('${track.id}', '${track.name.replace(/'/g, "\\'")}', '${track.artist.replace(/'/g, "\\'")}', '${track.album.replace(/'/g, "\\'")}', '${track.image}', '${track.preview_url || ''}')">
                    <img src="${track.image || 'https://via.placeholder.com/50'}" alt="${track.name}" class="w-12 h-12 rounded">
                    <div class="flex-1">
                        <p class="font-semibold text-sm">${track.name}</p>
                        <p class="text-gray-600 text-xs">${track.artist} • ${track.album}</p>
                    </div>
                </div>
            `).join('');
        }

        function selectMusic(id, name, artist, album, image, previewUrl) {
            selectedMusic = { id, name, artist, album, image, preview_url: previewUrl };
            document.getElementById('musicTitle').textContent = name;
            document.getElementById('musicArtist').textContent = artist;
            document.getElementById('musicImage').src = image || 'https://via.placeholder.com/50';
            document.getElementById('musicPreview').classList.remove('hidden');
            closeMusicSearch();
        }

        function showEmojiPicker() {
            document.getElementById('emojiPickerModal').classList.remove('hidden');
        }

        function closeEmojiPicker() {
            document.getElementById('emojiPickerModal').classList.add('hidden');
        }

        function addEmoji(emoji) {
            const textarea = document.getElementById('postContent');
            textarea.value += emoji;
            textarea.focus();
            closeEmojiPicker();
        }

        async function likePost(postId) {
            try {
                const response = await fetch('?action=like_post', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId })
                });

                const result = await response.json();
                if (result.success) {
                    document.getElementById(`likes_${postId}`).textContent = result.likes;
                }
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }

        function toggleAudio(audioId) {
            const audio = document.getElementById(audioId);
            const icon = document.getElementById(audioId.replace('audio_', 'icon_'));
            
            if (!audio) return;
            
            if (audio.paused) {
                audio.play();
                icon.className = 'fas fa-pause';
            } else {
                audio.pause();
                icon.className = 'fas fa-play';
            }

            audio.addEventListener('ended', () => {
                icon.className = 'fas fa-play';
            });
        }

        function showToast(message, type = 'info') {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };

            const toast = document.createElement('div');
            toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }
    </script>
</body>
</html>