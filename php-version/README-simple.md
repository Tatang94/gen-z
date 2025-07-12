# GenZ Social Media - Versi PHP Sederhana

## Deskripsi
Versi PHP yang sudah disederhanakan dalam satu file `index-simple.php` dengan fitur lengkap termasuk admin dashboard.

## Fitur Lengkap

### Fitur Utama
- ✅ **Splash Screen** - Animasi loading dengan logo dan tagline menarik
- ✅ **Feed Posts** - Buat, like, dan lihat postingan
- ✅ **Stories** - Section untuk cerita (interface siap)
- ✅ **Responsive Design** - Mobile-first dengan bottom navigation
- ✅ **Database SQLite** - Otomatis setup dan populasi data

### Fitur Admin Dashboard
- ✅ **Dashboard Stats** - Total users, posts, verified users, likes
- ✅ **User Management** - View, verify, delete users
- ✅ **Post Management** - View, delete posts
- ✅ **Real-time Updates** - Data langsung update setelah aksi
- ✅ **Responsive Admin** - Interface admin mobile-friendly

## Instalasi Super Mudah

1. Upload file `index-simple.php` ke web server
2. Buka di browser
3. Selesai! Database akan otomatis terbuat

## Teknologi
- **Backend**: PHP 7.4+ dengan SQLite
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **UI Framework**: Tailwind CSS 2.2
- **Icons**: Font Awesome 6.0

## Default Data
Sudah terisi dengan 3 user Indonesia dan postingan sample:
- Andi Pratama (Jakarta) - Verified ✓
- Sari Melati (Bandung)
- Budi Santoso (Yogyakarta)

## Akses Admin
Klik tombol "Admin" di bottom navigation untuk mengakses dashboard admin dengan fitur:
- Statistik real-time
- Manajemen user dan verifikasi
- Moderasi konten dan post

## Keamanan
- ✅ Prepared statements untuk SQL injection protection
- ✅ Input validation dan sanitization
- ✅ Session security
- ✅ XSS protection

## File Structure
```
index-simple.php    (Satu file lengkap - 680+ baris)
├── Database setup & sample data
├── API endpoints (posts, users, admin)
├── Frontend HTML & CSS
└── JavaScript functionality
```

Total ukuran: ~35KB - Sangat ringan dan cepat!