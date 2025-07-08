<?php
// Test file untuk versi PHP GenZ Social Media
// File ini digunakan untuk mengecek apakah semua komponen berfungsi dengan baik

header('Content-Type: application/json');

echo "<!DOCTYPE html>\n";
echo "<html lang='id'>\n";
echo "<head>\n";
echo "    <meta charset='UTF-8'>\n";
echo "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n";
echo "    <title>Test Status - GenZ Social Media PHP</title>\n";
echo "    <style>\n";
echo "        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }\n";
echo "        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }\n";
echo "        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }\n";
echo "        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }\n";
echo "        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }\n";
echo "        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }\n";
echo "        h1 { color: #333; text-align: center; }\n";
echo "        h2 { color: #666; border-bottom: 2px solid #eee; padding-bottom: 10px; }\n";
echo "        .test-item { margin: 15px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; }\n";
echo "    </style>\n";
echo "</head>\n";
echo "<body>\n";
echo "    <div class='container'>\n";
echo "        <h1>🧪 Test Status GenZ Social Media PHP Version</h1>\n";

$tests_passed = 0;
$total_tests = 0;

echo "        <h2>1. Database Connection Test</h2>\n";
$total_tests++;
try {
    require_once 'config/database.php';
    echo "        <div class='status success'>✅ Database connection: SUCCESS</div>\n";
    $tests_passed++;
} catch (Exception $e) {
    echo "        <div class='status error'>❌ Database connection: FAILED - " . $e->getMessage() . "</div>\n";
}

echo "        <h2>2. Database Tables Test</h2>\n";
$total_tests++;
try {
    $tables = ['users', 'posts', 'comments', 'stories', 'follows', 'post_likes'];
    $existing_tables = [];
    
    foreach ($tables as $table) {
        $stmt = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?");
        $stmt->execute([$table]);
        if ($stmt->fetch()) {
            $existing_tables[] = $table;
        }
    }
    
    if (count($existing_tables) == count($tables)) {
        echo "        <div class='status success'>✅ All tables created: SUCCESS (" . implode(', ', $existing_tables) . ")</div>\n";
        $tests_passed++;
    } else {
        echo "        <div class='status error'>❌ Missing tables: " . implode(', ', array_diff($tables, $existing_tables)) . "</div>\n";
    }
} catch (Exception $e) {
    echo "        <div class='status error'>❌ Table check: FAILED - " . $e->getMessage() . "</div>\n";
}

echo "        <h2>3. API Endpoints Test</h2>\n";
$api_files = ['posts.php', 'stories.php', 'users.php'];
foreach ($api_files as $file) {
    $total_tests++;
    if (file_exists("api/$file")) {
        echo "        <div class='status success'>✅ API file api/$file: EXISTS</div>\n";
        $tests_passed++;
    } else {
        echo "        <div class='status error'>❌ API file api/$file: MISSING</div>\n";
    }
}

echo "        <h2>4. Frontend Files Test</h2>\n";
$frontend_files = ['index.php', 'js/app.js', 'assets/styles.css'];
foreach ($frontend_files as $file) {
    $total_tests++;
    if (file_exists($file)) {
        echo "        <div class='status success'>✅ Frontend file $file: EXISTS</div>\n";
        $tests_passed++;
    } else {
        echo "        <div class='status error'>❌ Frontend file $file: MISSING</div>\n";
    }
}

echo "        <h2>5. Database Independence Test</h2>\n";
$total_tests++;
try {
    // Test if we can insert without foreign key constraints
    $stmt = $pdo->prepare("INSERT INTO posts (content, user_id) VALUES (?, ?)");
    $stmt->execute(['Test post without existing user', 999]);
    
    $stmt = $pdo->prepare("DELETE FROM posts WHERE content = ?");
    $stmt->execute(['Test post without existing user']);
    
    echo "        <div class='status success'>✅ Database independence: SUCCESS (No foreign key constraints)</div>\n";
    $tests_passed++;
} catch (Exception $e) {
    echo "        <div class='status error'>❌ Database independence: FAILED - " . $e->getMessage() . "</div>\n";
}

echo "        <h2>📊 Test Summary</h2>\n";
$percentage = round(($tests_passed / $total_tests) * 100);

if ($percentage == 100) {
    echo "        <div class='status success'>\n";
    echo "            <h3>🎉 ALL TESTS PASSED!</h3>\n";
    echo "            <p>✅ Versi PHP: <strong>100% OK</strong></p>\n";
    echo "            <p>✅ Database SQL: <strong>BEBAS TANPA KETERKAITAN</strong></p>\n";
    echo "            <p>✅ Semua API endpoints tersedia</p>\n";
    echo "            <p>✅ Frontend interface lengkap</p>\n";
    echo "            <p>✅ Siap untuk production</p>\n";
} else {
    echo "        <div class='status error'>\n";
    echo "            <h3>❌ Some Tests Failed</h3>\n";
}

echo "            <p><strong>Test Results: $tests_passed/$total_tests ($percentage%)</strong></p>\n";
echo "        </div>\n";

echo "        <div class='test-item'>\n";
echo "            <h3>🚀 Quick Start Guide</h3>\n";
echo "            <ol>\n";
echo "                <li>Upload semua file ke web server</li>\n";
echo "                <li>Pastikan PHP 7.4+ dengan PDO extension</li>\n";
echo "                <li>Akses index.php di browser</li>\n";
echo "                <li>Database akan otomatis terbuat (SQLite)</li>\n";
echo "                <li>Aplikasi siap digunakan!</li>\n";
echo "            </ol>\n";
echo "        </div>\n";

echo "        <div class='test-item'>\n";
echo "            <h3>📋 Features</h3>\n";
echo "            <ul>\n";
echo "                <li>✅ Interface responsive modern</li>\n";
echo "                <li>✅ Database SQLite/MySQL support</li>\n";
echo "                <li>✅ API endpoints lengkap</li>\n";
echo "                <li>✅ No foreign key constraints</li>\n";
echo "                <li>✅ Empty state (no demo data)</li>\n";
echo "                <li>✅ Mobile-first design</li>\n";
echo "            </ul>\n";
echo "        </div>\n";

echo "    </div>\n";
echo "</body>\n";
echo "</html>\n";
?>