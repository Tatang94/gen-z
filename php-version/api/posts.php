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
            // Get all posts - BEBAS TANPA KETERKAITAN
            $stmt = $pdo->prepare("
                SELECT p.*, 
                       COALESCE((SELECT username FROM users WHERE id = p.user_id), 'user_' || p.user_id) as username,
                       COALESCE((SELECT display_name FROM users WHERE id = p.user_id), 'User ' || p.user_id) as display_name,
                       COALESCE((SELECT avatar FROM users WHERE id = p.user_id), '') as avatar,
                       COALESCE((SELECT is_verified FROM users WHERE id = p.user_id), 0) as is_verified,
                       COALESCE((SELECT COUNT(*) FROM comments WHERE post_id = p.id), 0) as comments_count
                FROM posts p 
                ORDER BY p.created_at DESC
            ");
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format posts for frontend
            $formatted_posts = [];
            foreach ($posts as $post) {
                $formatted_posts[] = [
                    'id' => $post['id'],
                    'userId' => $post['user_id'],
                    'content' => $post['content'],
                    'image' => $post['image'],
                    'musicData' => $post['music_data'] ? json_decode($post['music_data'], true) : null,
                    'timestamp' => $post['created_at'],
                    'likes' => $post['likes'],
                    'comments' => [],
                    'shares' => $post['shares'],
                    'isLiked' => false,
                    'isShared' => false,
                    'user' => [
                        'id' => $post['user_id'],
                        'username' => $post['username'],
                        'displayName' => $post['display_name'],
                        'avatar' => $post['avatar'],
                        'isVerified' => (bool)$post['is_verified']
                    ]
                ];
            }
            
            echo json_encode($formatted_posts);
            break;
            
        case 'POST':
            // Create new post
            if (!isset($request['content']) || empty(trim($request['content']))) {
                throw new Exception('Content is required');
            }
            
            $userId = $request['userId'] ?? 1; // Default user if not provided
            $content = trim($request['content']);
            $image = $request['image'] ?? '';
            $musicData = isset($request['musicData']) ? json_encode($request['musicData']) : '';
            
            $stmt = $pdo->prepare("
                INSERT INTO posts (user_id, content, image, music_data) 
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$userId, $content, $image, $musicData]);
            
            $postId = $pdo->lastInsertId();
            
            // Update user's posts count
            $stmt = $pdo->prepare("UPDATE users SET posts_count = posts_count + 1 WHERE id = ?");
            $stmt->execute([$userId]);
            
            // Get the created post - BEBAS TANPA KETERKAITAN
            $stmt = $pdo->prepare("
                SELECT p.*, 
                       COALESCE((SELECT username FROM users WHERE id = p.user_id), 'user_' || p.user_id) as username,
                       COALESCE((SELECT display_name FROM users WHERE id = p.user_id), 'User ' || p.user_id) as display_name,
                       COALESCE((SELECT avatar FROM users WHERE id = p.user_id), '') as avatar,
                       COALESCE((SELECT is_verified FROM users WHERE id = p.user_id), 0) as is_verified
                FROM posts p 
                WHERE p.id = ?
            ");
            $stmt->execute([$postId]);
            $post = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $formatted_post = [
                'id' => $post['id'],
                'userId' => $post['user_id'],
                'content' => $post['content'],
                'image' => $post['image'],
                'musicData' => $post['music_data'] ? json_decode($post['music_data'], true) : null,
                'timestamp' => $post['created_at'],
                'likes' => $post['likes'],
                'comments' => [],
                'shares' => $post['shares'],
                'isLiked' => false,
                'isShared' => false,
                'user' => [
                    'id' => $post['user_id'],
                    'username' => $post['username'],
                    'displayName' => $post['display_name'],
                    'avatar' => $post['avatar'],
                    'isVerified' => (bool)$post['is_verified']
                ]
            ];
            
            echo json_encode($formatted_post);
            break;
            
        case 'DELETE':
            // Delete post
            $postId = $_GET['id'] ?? 0;
            
            if (!$postId) {
                throw new Exception('Post ID is required');
            }
            
            // Get user_id for updating posts count
            $stmt = $pdo->prepare("SELECT user_id FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            $userId = $stmt->fetchColumn();
            
            if (!$userId) {
                throw new Exception('Post not found');
            }
            
            // Delete post
            $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
            $stmt->execute([$postId]);
            
            // Update user's posts count
            $stmt = $pdo->prepare("UPDATE users SET posts_count = posts_count - 1 WHERE id = ?");
            $stmt->execute([$userId]);
            
            echo json_encode(['success' => true, 'message' => 'Post deleted successfully']);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>