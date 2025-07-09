# Panduan Deploy ke Vercel

## Langkah-langkah Deploy

### 1. Persiapan Project
```bash
# Build project terlebih dahulu
npm run build
```

### 2. Install Vercel CLI (Opsional)
```bash
npm i -g vercel
```

### 3. Deploy via Website Vercel
1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub/GitLab
3. Import repository ini
4. Vercel akan otomatis detect Next.js/React project
5. Klik "Deploy"

### 4. Deploy via CLI
```bash
# Login ke Vercel
vercel login

# Deploy project
vercel

# Deploy ke production
vercel --prod
```

### 5. Environment Variables
Jika menggunakan database PostgreSQL, tambahkan di Vercel Dashboard:
- `DATABASE_URL` - URL koneksi PostgreSQL

### 6. Custom Domain (Opsional)
1. Buka Vercel Dashboard
2. Pilih project
3. Go to Settings > Domains
4. Tambahkan domain custom

## File Konfigurasi

### vercel.json
File ini sudah disiapkan dengan konfigurasi:
- Build setup untuk Node.js server
- Static file serving
- API routes configuration
- Environment variables

### Package.json Scripts
- `npm run build` - Build untuk production
- `npm run start` - Start production server
- `npm run dev` - Development server

## Troubleshooting

### Error Build
- Pastikan semua dependencies terinstall
- Check TypeScript errors dengan `npm run check`
- Pastikan build script berjalan sukses local

### Database Issues
- Gunakan PostgreSQL untuk production (bukan SQLite)
- Set DATABASE_URL di environment variables
- Run migrations jika diperlukan

### Static Files
- File static akan di-serve dari `/dist/public`
- Images dan assets harus dalam folder public

## Production Checklist
- [ ] Build berhasil tanpa error
- [ ] Database production ready
- [ ] Environment variables di-set
- [ ] Custom domain (jika ada)
- [ ] SSL certificate aktif