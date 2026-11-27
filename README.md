# Harvest Studio (@harvest_studiophoto) - Photography & Videography Platform

Website resmi studio foto & videografi profesional yang memungkinkan pelanggan melihat katalog karya, membandingkan paket layanan, dan melakukan pemesanan (booking) secara daring dengan kalender anti bentrok dan pelacakan invoice. Dilengkapi panel admin mandiri untuk pemilik studio.

Dirancang sesuai spesifikasi PRD dan referensi desain bertema gelap-mewah (*Dark Luxury: Charcoal & Gold/Cream*).

---

## 🚀 Fitur Utama

1. **Homepage Mewah & Sinematik**:
   - Hero fullscreen dengan tipografi serif elegan dan aksen tulisan tangan (*We Capture Emotions. You Live Them.*)
   - Lencana pengalaman 10+ tahun
   - Bar kategori layanan floating (Wedding, Studio/Portraits, Acara, Videografi, Edit, Cetak)
   - Galeri portofolio unggulan (*Moments We've Captured*) dengan lightbox modal
   - Banner paket terlaris & testimoni pelanggan bintang 5
   - Feed Instagram strip (@harvest_studiophoto) & tombol WhatsApp melayang

2. **Katalog Paket & Bandingkan (`/paket`)**:
   - Filter real-time berdasarkan kategori, tipe lokasi (studio/outdoor), dan rentang harga slider
   - Pencarian paket dan pengurutan harga
   - Fitur **Wishlist** (`/wishlist`) tersimpan di perangkat tanpa login
   - Fitur **Bandingkan Paket** (`/paket/bandingkan`) hingga 3 paket berdampingan (*side-by-side comparison table*)
   - Halaman detail paket (`/paket/[slug]`) lengkap dengan kalkulator add-on real-time

3. **Galeri Portofolio (`/portofolio`)**:
   - Galeri foto satu tone warna (*Warm Luxury / Cinematic Champagne & Amber-Gold*)
   - Filter berdasarkan kategori dan tag
   - Lightbox interaktif dengan multi-foto sesi

4. **Sistem Booking Kalender (Anti-Double Booking) (`/booking`)**:
   - *Stepper* 4 langkah: Pilih Paket → Kalender & Jam → Data Diri & Add-on → Pembayaran DP
   - Pengecekan otomatis: mencegah bentrok jadwal pada tanggal & jam yang sama
   - Perhitungan otomatis DP (50% studio / 30% wedding)
   - Metode pembayaran transfer manual (BCA & Mandiri) dengan unggah bukti transfer
   - Simulasi pembayaran otomatis QRIS / Virtual Account untuk kemudahan pengujian

5. **Layanan Edit Foto & Cetak Presisi (`/edit-cetak`)**:
   - Interactive Before/After slider perbandingan retouch foto
   - Formulir pesanan edit foto & cetak bingkai lab dengan tautan Google Drive / unggah berkas
   - Pelacakan status pengerjaan produksi

6. **Pelacakan Status Pesanan & Invoice (`/status`)**:
   - Pencarian berdasarkan kode booking (`HSV-...` atau `HSE-...`) dan nomor WhatsApp
   - Unduh / cetak invoice resmi PDF
   - Fitur susulan unggah bukti transfer jika masih pending

7. **Panel Admin Lengkap (`/admin`)**:
   - Ringkasan KPI: total pesanan, pendapatan terverifikasi, jadwal hari ini
   - Manajemen Pesanan: konfirmasi booking, verifikasi bukti transfer
   - Manajemen Pesanan Edit & Cetak: perbarui status produksi (Diterima -> Diproses -> Selesai -> Siap Diambil)
   - Manajemen Jadwal: blokir tanggal studio (libur/agenda penuh)
   - Manajemen Paket & Portofolio
   - Pengaturan Studio & Tema (multi-klien *white-label*): nama studio, logo, rekening bank, nomor WhatsApp

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Prisma ORM (SQLite), Multer, JWT Auth, Bcryptjs

---

## 💻 Panduan Instalasi & Menjalankan Project

### 1. Clone Repository
```bash
git clone https://github.com/revandaaw/harvest-studio.git
cd harvest-studio
```

### 2. Setup & Menjalankan Backend (Port 5000)
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npx prisma generate
npx tsx prisma/seed.ts
npm run dev
```
Backend akan berjalan di: `http://localhost:5000`

### 3. Setup & Menjalankan Frontend (Port 3000)
Buka terminal baru:
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Frontend akan berjalan di: `http://localhost:3000`

---

## 🔑 Kredensial Login Admin Default
- **URL Admin**: `http://localhost:3000/admin`
- **Email**: `admin@harveststudio.com`
- **Password**: `admin123`
