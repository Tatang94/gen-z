# Setup Database untuk Produksi

## Untuk menggunakan PostgreSQL di Replit:

1. **Klik tab "Secrets" di sidebar Replit**
2. **Tambahkan secret dengan key: `DATABASE_URL`**
3. **Masukkan connection string PostgreSQL Anda:**
   ```
   postgresql://username:password@host:port/database_name
   ```

## Untuk menggunakan Neon Database (Recommended):

1. **Buat akun di https://neon.tech**
2. **Buat database baru**
3. **Copy connection string dari dashboard Neon**
4. **Tambahkan ke Replit Secrets dengan key: `DATABASE_URL`**

## Untuk development (saat ini):

- Aplikasi menggunakan SQLite database
- Database file: `database.sqlite`
- Otomatis terinisialisasi dengan sample data
- Tidak perlu setup tambahan

## Fitur Database yang Tersedia:

- ✅ User management (create, read, update, delete)
- ✅ Post management dengan media support  
- ✅ Comment system
- ✅ Stories functionality
- ✅ Like dan share system
- ✅ Admin dashboard dengan full CRUD

## Migration Commands:

```bash
# Push schema ke database
npm run db:push

# Generate migrations
npm run db:generate

# View database studio
npm run db:studio
```

## Status Saat Ini:

- Database: SQLite (Development Ready)
- All tables created and populated
- Admin dashboard functional
- All API endpoints working