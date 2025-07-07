# GenZ Social Media - PHP Version

Versi PHP dari aplikasi media sosial GenZ dengan tampilan yang sama seperti versi Node.js tetapi tanpa data demo.

## Fitur Utama

- **Interface Modern**: Desain yang responsif dan menarik untuk generasi Z
- **Sistem Posting**: Buat postingan dengan teks, gambar, dan musik
- **Stories**: Bagikan momen dengan fitur stories 24 jam
- **Navigasi Mobile**: Bottom navigation untuk pengalaman mobile yang optimal
- **Database Fleksibel**: Mendukung MySQL dan SQLite sebagai fallback
- **API RESTful**: Endpoint API yang lengkap untuk semua fitur

## Struktur Proyek

```
php-version/
├── index.php              # Halaman utama aplikasi
├── config/
│   └── database.php       # Konfigurasi database
├── api/
│   ├── posts.php          # API untuk posts
│   ├── stories.php        # API untuk stories
│   └── users.php          # API untuk users
├── assets/
│   └── styles.css         # Style CSS tambahan
├── js/
│   └── app.js             # JavaScript aplikasi
└── README.md              # Dokumentasi ini
```

## Persyaratan Sistem

- **PHP 7.4+** dengan extension PDO
- **MySQL 5.7+** atau **SQLite 3** (fallback)
- **Web Server** (Apache/Nginx)
- **Modern Browser** dengan JavaScript enabled

## Instalasi

### 1. Clone atau Copy Files
```bash
# Copy semua file ke direktori web server
cp -r php-version/* /var/www/html/genz-social/
```

### 2. Setup Database

#### Option A: MySQL
1. Buat database baru:
```sql
CREATE DATABASE social_media;
```

2. Update konfigurasi di `config/database.php`:
```php
$host = 'localhost';
$dbname = 'social_media';
$username = 'your_username';
$password = 'your_password';
```

#### Option B: SQLite (Otomatis)
Jika MySQL tidak tersedia, aplikasi akan otomatis menggunakan SQLite dan membuat file `database.db`.

### 3. Setup Web Server

#### Apache
```apache
<VirtualHost *:80>
    ServerName genz-social.local
    DocumentRoot /var/www/html/genz-social
    DirectoryIndex index.php
    
    <Directory /var/www/html/genz-social>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name genz-social.local;
    root /var/www/html/genz-social;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

### 4. Setup Permissions
```bash
# Berikan permission untuk upload files
chmod 755 /var/www/html/genz-social
chmod 666 /var/www/html/genz-social/database.db  # jika menggunakan SQLite
```

## API Endpoints

### Posts API (`/api/posts.php`)
- `GET /api/posts.php` - Ambil semua posts
- `POST /api/posts.php` - Buat post baru
- `DELETE /api/posts.php?id={id}` - Hapus post

### Stories API (`/api/stories.php`)
- `GET /api/stories.php` - Ambil semua stories
- `POST /api/stories.php` - Buat story baru
- `DELETE /api/stories.php?id={id}` - Hapus story

### Users API (`/api/users.php`)
- `GET /api/users.php` - Ambil semua users
- `GET /api/users.php?search={query}` - Cari users
- `POST /api/users.php` - Registrasi user baru
- `PUT /api/users.php?id={id}` - Update profil user

## Database Schema

### Tabel Users
```sql
CREATE TABLE users (
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
);
```

### Tabel Posts
```sql
CREATE TABLE posts (
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
);
```

### Tabel Stories
```sql
CREATE TABLE stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Fitur yang Tersedia

### ✅ Sudah Diimplementasi
- Interface responsif dengan desain modern
- Splash screen dengan animasi
- Navigasi mobile dengan bottom tabs
- Create post modal dengan validasi
- Create story modal dengan upload gambar
- Empty state untuk posts dan stories kosong
- Toast notifications untuk feedback
- API endpoints lengkap dengan error handling
- Database schema yang robust
- Fallback SQLite jika MySQL tidak tersedia

### 🔄 Dalam Pengembangan
- Upload gambar untuk posts dan stories
- Sistem autentikasi dan login
- Fitur like dan comment
- Sistem follow/unfollow
- Real-time chat
- Push notifications
- Search dan discovery
- Profile management

## Customization

### Mengubah Warna Tema
Edit file `assets/styles.css` untuk mengubah warna utama:
```css
.btn-primary {
    background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%);
}
```

### Menambah Fitur Baru
1. Buat endpoint API baru di folder `api/`
2. Update JavaScript di `js/app.js` untuk handle fitur baru
3. Tambahkan UI elements di `index.php`

## Troubleshooting

### Database Connection Error
- Pastikan MySQL service berjalan
- Cek kredensial database di `config/database.php`
- Pastikan user memiliki permission untuk database

### File Upload Error
- Cek permission folder untuk write access
- Pastikan `php.ini` mengizinkan file upload
- Cek `upload_max_filesize` dan `post_max_size`

### JavaScript Error
- Pastikan browser mendukung ES6+
- Cek browser console untuk error details
- Pastikan Lucide icons loaded dengan benar

## Kontribusi

Untuk menambah fitur atau memperbaiki bug:
1. Fork repository
2. Buat branch baru untuk fitur
3. Commit dan push changes
4. Buat pull request

## Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan aplikasi media sosial modern.

## Support

Jika ada pertanyaan atau butuh bantuan, silakan buat issue di repository atau hubungi tim pengembang.

---

**GenZ Social Media** - Aplikasi media sosial untuk generasi digital 🚀