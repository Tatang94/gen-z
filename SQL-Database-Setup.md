# GenZ Social Media - Standalone Database Setup

Dokumentasi lengkap untuk setup database GenZ Social Media tanpa ketergantungan apapun.

## File SQL yang Tersedia

### 1. `genZ-social-media.sql` - MySQL/PostgreSQL Version
**Untuk hosting yang mendukung MySQL atau PostgreSQL**

**Fitur:**
- ✅ Kompatibel dengan MySQL 5.7+ dan PostgreSQL 10+
- ✅ Stored procedures untuk operasi kompleks
- ✅ Auto-increment dengan AUTO_INCREMENT
- ✅ JSON data type untuk musik posts
- ✅ Advanced triggers dan constraints
- ✅ Optimized untuk production hosting

**Cara Install:**
```bash
# MySQL
mysql -u username -p database_name < genZ-social-media.sql

# PostgreSQL  
psql -U username -d database_name -f genZ-social-media.sql
```

### 2. `genZ-social-media-sqlite.sql` - SQLite Version
**Untuk hosting sederhana atau development**

**Fitur:**
- ✅ Kompatibel dengan SQLite 3.6+
- ✅ Tidak perlu server database terpisah
- ✅ File-based database yang portable
- ✅ Sempurna untuk shared hosting
- ✅ Triggers yang dioptimasi untuk SQLite

**Cara Install:**
```bash
# SQLite
sqlite3 genz_database.db < genZ-social-media-sqlite.sql
```

## Database Schema

### Tables Structure

| Table | Purpose | Records |
|-------|---------|---------|
| **users** | User profiles & authentication | 6 sample users |
| **posts** | User posts with content & media | 10 sample posts |
| **comments** | Post comments & replies | 7 sample comments |
| **stories** | Temporary stories (24h expire) | 5 sample stories |

### Sample Data Included

**Indonesian Users:**
- 🇮🇩 Andi Pratama (Jakarta) - Tech enthusiast
- 🇮🇩 Sari Dewi (Bandung) - Photographer  
- 🇮🇩 Budi Santoso (Surabaya) - Entrepreneur
- 🇮🇩 Maya Putri (Yogyakarta) - Artist
- 🇮🇩 Rizki Ramadhan (Bali) - Digital nomad
- 🇮🇩 GenZ Admin - Platform administrator

**Content Features:**
- Authentic Indonesian social media posts
- Real location tags from Indonesian cities
- Cultural references and local hashtags
- Realistic engagement numbers (likes, shares, comments)

## Key Features

### 🔧 Auto-Generated IDs
```sql
-- Auto-increment primary keys
id INTEGER PRIMARY KEY AUTO_INCREMENT  -- MySQL/PostgreSQL
id INTEGER PRIMARY KEY AUTOINCREMENT   -- SQLite
```

### 🔗 Proper Relationships
```sql
-- Foreign key constraints
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
```

### ⚡ Performance Indexes
```sql
-- Optimized indexes for common queries
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
```

### 🎯 Useful Views
```sql
-- Pre-built views for complex queries
CREATE VIEW posts_with_users AS
SELECT p.*, u.username, u.display_name, u.avatar, u.is_verified
FROM posts p JOIN users u ON p.user_id = u.id;
```

### 🔄 Auto-Update Triggers
```sql
-- Automatically update counters
CREATE TRIGGER after_post_insert
AFTER INSERT ON posts
FOR EACH ROW
BEGIN
    UPDATE users SET posts_count = posts_count + 1 WHERE id = NEW.user_id;
END;
```

## Common Hosting Scenarios

### Shared Hosting (cPanel)
1. Use **genZ-social-media.sql** untuk MySQL
2. Upload file via phpMyAdmin
3. Import database dengan satu klik
4. Update connection string di aplikasi

### VPS/Cloud Hosting
1. Pilih sesuai database yang tersedia:
   - **MySQL/MariaDB**: gunakan genZ-social-media.sql
   - **PostgreSQL**: gunakan genZ-social-media.sql  
   - **SQLite**: gunakan genZ-social-media-sqlite.sql

### Development/Testing
1. Gunakan **genZ-social-media-sqlite.sql**
2. Tidak perlu setup server database
3. Instant setup untuk prototyping
4. Easy backup dan restore

## Connection Examples

### PHP Connection
```php
// MySQL
$pdo = new PDO("mysql:host=localhost;dbname=genz_db", $user, $pass);

// SQLite
$pdo = new PDO("sqlite:genz_database.db");
```

### Node.js Connection
```javascript
// MySQL
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'genz_db'
});

// SQLite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('genz_database.db');
```

### Python Connection
```python
# MySQL
import mysql.connector
conn = mysql.connector.connect(
  host='localhost',
  user='username',
  password='password',
  database='genz_db'
)

# SQLite
import sqlite3
conn = sqlite3.connect('genz_database.db')
```

## Sample Queries

### Get User Profile
```sql
SELECT username, display_name, bio, followers, following, posts_count 
FROM users WHERE username = 'andi_jakarta';
```

### Get Recent Posts
```sql
SELECT * FROM posts_with_users 
ORDER BY created_at DESC LIMIT 10;
```

### Search Users
```sql
SELECT * FROM users 
WHERE display_name LIKE '%andi%' OR username LIKE '%andi%'
ORDER BY followers DESC;
```

### Get Trending Posts
```sql
SELECT *, (likes + shares + comments_count) as engagement
FROM posts_with_users 
ORDER BY engagement DESC LIMIT 10;
```

### Get Active Stories
```sql
SELECT * FROM stories_with_users 
WHERE expires_at > NOW()  -- MySQL/PostgreSQL
-- WHERE expires_at > datetime('now')  -- SQLite
ORDER BY created_at DESC;
```

## Migration Notes

### From Development to Production
1. Export data dari SQLite
2. Convert ke MySQL/PostgreSQL format
3. Import ke production database
4. Update connection strings

### Backup Strategy
```bash
# MySQL Backup
mysqldump -u username -p genz_db > backup.sql

# SQLite Backup
cp genz_database.db backup_$(date +%Y%m%d).db

# PostgreSQL Backup
pg_dump -U username genz_db > backup.sql
```

## Troubleshooting

### Common Issues

**MySQL: "Unknown column" errors**
- Pastikan menggunakan MySQL 5.7+ untuk JSON support
- Atau ganti JSON dengan TEXT untuk versi lama

**SQLite: "No such table" errors**  
- Pastikan file .sql dijalankan dengan benar
- Check file permissions untuk database file

**PostgreSQL: "Permission denied"**
- Pastikan user memiliki privileges CREATE dan INSERT
- Set proper database ownership

### Performance Tips
1. **Index Usage**: Query selalu menggunakan indexed columns
2. **LIMIT Queries**: Selalu gunakan LIMIT untuk pagination
3. **Connection Pooling**: Gunakan connection pooling untuk traffic tinggi
4. **Regular Maintenance**: VACUUM untuk SQLite, OPTIMIZE untuk MySQL

---

## Summary

Kedua file SQL ini menyediakan:
- ✅ **Zero Dependencies** - Bisa jalan di hosting manapun
- ✅ **Complete Schema** - Semua table, index, dan relationship
- ✅ **Sample Data** - Data Indonesian yang realistic
- ✅ **Production Ready** - Optimized untuk performa
- ✅ **Easy Migration** - Tinggal import dan jalan

Pilih sesuai environment hosting Anda dan langsung deploy!