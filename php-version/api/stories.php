<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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
            // Get all stories - BEBAS TANPA KETERKAITAN  
            $stmt = $pdo->prepare("
                SELECT s.*, 
                       COALESCE((SELECT username FROM users WHERE id = s.user_id), 'user_' || s.user_id) as username,
                       COALESCE((SELECT display_name FROM users WHERE id = s.user_id), 'User ' || s.user_id) as display_name,
                       COALESCE((SELECT avatar FROM users WHERE id = s.user_id), '') as avatar,
                       COALESCE((SELECT is_verified FROM users WHERE id = s.user_id), 0) as is_verified
                FROM stories s 
                WHERE s.created_at >= datetime('now', '-24 hours')
                ORDER BY s.created_at DESC
            ");
            $stmt->execute();
            $stories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Format stories for frontend
            $formatted_stories = [];
            foreach ($stories as $story) {
                $formatted_stories[] = [
                    'id' => $story['id'],
                    'userId' => $story['user_id'],
                    'image' => $story['image'],
                    'timestamp' => $story['created_at'],
                    'isViewed' => false,
                    'user' => [
                        'id' => $story['user_id'],
                        'username' => $story['username'],
                        'displayName' => $story['display_name'],
                        'avatar' => $story['avatar'],
                        'isVerified' => (bool)$story['is_verified']
                    ]
                ];
            }
            
            echo json_encode($formatted_stories);
            break;
            
        case 'POST':
            // Create new story
            if (!isset($request['image']) || empty($request['image'])) {
                throw new Exception('Image is required for story');
            }
            
            $userId = $request['userId'] ?? 1; // Default user if not provided
            $image = $request['image'];
            
            $stmt = $pdo->prepare("
                INSERT INTO stories (user_id, image) 
                VALUES (?, ?)
            ");
            $stmt->execute([$userId, $image]);
            
            $storyId = $pdo->lastInsertId();
            
            // Get the created story - BEBAS TANPA KETERKAITAN
            $stmt = $pdo->prepare("
                SELECT s.*, 
                       COALESCE((SELECT username FROM users WHERE id = s.user_id), 'user_' || s.user_id) as username,
                       COALESCE((SELECT display_name FROM users WHERE id = s.user_id), 'User ' || s.user_id) as display_name,
                       COALESCE((SELECT avatar FROM users WHERE id = s.user_id), '') as avatar,
                       COALESCE((SELECT is_verified FROM users WHERE id = s.user_id), 0) as is_verified
                FROM stories s 
                WHERE s.id = ?
            ");
            $stmt->execute([$storyId]);
            $story = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $formatted_story = [
                'id' => $story['id'],
                'userId' => $story['user_id'],
                'image' => $story['image'],
                'timestamp' => $story['created_at'],
                'isViewed' => false,
                'user' => [
                    'id' => $story['user_id'],
                    'username' => $story['username'],
                    'displayName' => $story['display_name'],
                    'avatar' => $story['avatar'],
                    'isVerified' => (bool)$story['is_verified']
                ]
            ];
            
            echo json_encode($formatted_story);
            break;
            
        case 'DELETE':
            // Delete story
            $storyId = $_GET['id'] ?? 0;
            
            if (!$storyId) {
                throw new Exception('Story ID is required');
            }
            
            $stmt = $pdo->prepare("DELETE FROM stories WHERE id = ?");
            $stmt->execute([$storyId]);
            
            echo json_encode(['success' => true, 'message' => 'Story deleted successfully']);
            break;
            
        default:
            throw new Exception('Method not allowed');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>