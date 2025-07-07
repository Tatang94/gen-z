<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = json_decode(file_get_contents('php://input'), true);

try {
    switch ($method) {
        case 'GET':
            if (isset($_GET['search'])) {
                // Search users
                $search = '%' . $_GET['search'] . '%';
                $stmt = $pdo->prepare("
                    SELECT id, username, display_name, avatar, bio, followers, following, is_verified, is_online
                    FROM users 
                    WHERE username LIKE ? OR display_name LIKE ?
                    ORDER BY followers DESC
                    LIMIT 50
                ");
                $stmt->execute([$search, $search]);
            } else {
                // Get all users
                $stmt = $pdo->prepare("
                    SELECT id, username, display_name, avatar, bio, followers, following, posts_count, is_verified, is_online, created_at
                    FROM users 
                    ORDER BY created_at DESC
                ");
                $stmt->execute();
            }
            
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format users for frontend
            $formatted_users = [];
            foreach ($users as $user) {
                $formatted_users[] = [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'displayName' => $user['display_name'],
                    'avatar' => $user['avatar'],
                    'bio' => $user['bio'],
                    'followers' => $user['followers'],
                    'following' => $user['following'],
                    'posts' => $user['posts_count'] ?? 0,
                    'isVerified' => (bool)$user['is_verified'],
                    'isOnline' => (bool)$user['is_online'],
                    'joinDate' => $user['created_at'] ?? date('Y-m-d H:i:s')
                ];
            }
            
            echo json_encode($formatted_users);
            break;
            
        case 'POST':
            // Create new user (registration)
            if (!isset($request['username']) || !isset($request['email']) || !isset($request['password'])) {
                throw new Exception('Username, email, and password are required');
            }
            
            $username = trim($request['username']);
            $email = trim($request['email']);
            $password = $request['password'];
            $displayName = $request['displayName'] ?? $username;
            
            // Check if username or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                throw new Exception('Username or email already exists');
            }
            
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $pdo->prepare("
                INSERT INTO users (username, display_name, email, password_hash) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$username, $displayName, $email, $passwordHash]);
            
            $userId = $pdo->lastInsertId();
            
            // Get the created user
            $stmt = $pdo->prepare("
                SELECT id, username, display_name, email, avatar, bio, followers, following, posts_count, is_verified, created_at
                FROM users 
                WHERE id = ?
            ");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $formatted_user = [
                'id' => $user['id'],
                'username' => $user['username'],
                'displayName' => $user['display_name'],
                'email' => $user['email'],
                'avatar' => $user['avatar'],
                'bio' => $user['bio'],
                'followers' => $user['followers'],
                'following' => $user['following'],
                'posts' => $user['posts_count'],
                'isVerified' => (bool)$user['is_verified'],
                'joinDate' => $user['created_at']
            ];
            
            echo json_encode($formatted_user);
            break;
            
        case 'PUT':
            // Update user profile
            $userId = $_GET['id'] ?? 0;
            
            if (!$userId) {
                throw new Exception('User ID is required');
            }
            
            $updates = [];
            $params = [];
            
            if (isset($request['displayName'])) {
                $updates[] = 'display_name = ?';
                $params[] = $request['displayName'];
            }
            
            if (isset($request['bio'])) {
                $updates[] = 'bio = ?';
                $params[] = $request['bio'];
            }
            
            if (isset($request['avatar'])) {
                $updates[] = 'avatar = ?';
                $params[] = $request['avatar'];
            }
            
            if (isset($request['location'])) {
                $updates[] = 'location = ?';
                $params[] = $request['location'];
            }
            
            if (isset($request['website'])) {
                $updates[] = 'website = ?';
                $params[] = $request['website'];
            }
            
            if (empty($updates)) {
                throw new Exception('No fields to update');
            }
            
            $params[] = $userId;
            $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>