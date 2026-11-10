# Sistem Aspirasi & Pengaduan Siswa SMK IT

Platform modern dan interaktif untuk penyampaian, pelacakan, dan pengelolaan aspirasi serta pengaduan siswa SMK IT berbasis web dengan klasifikasi otomatis (NLP/AI), sistem tiket unik, papan aspirasi publik, dan dashboard admin.

---

## 🚀 Fitur Utama

- **Penyampaian Aspirasi Cerdas**
  - Prediksi kategori dan urgensi otomatis secara real-time berbasis NLP lokal (*Keyword & Sentiment Matcher*).
  - Opsi pelaporan terbuka maupun anonim.
  - Unggah lampiran foto/bukti pendukung (Base64 storage).
  - Generator kode tiket unik untuk pelacakan langsung.

- **Pelacakan Tiket (Tracking System)**
  - Cek progres status aspirasi (Pending, Diproses, Selesai, Ditolak).
  - Riwayat interaktif timeline status.
  - Diskusi 2 arah langsung antara pelapor dan pihak sekolah/admin.

- **Papan Aspirasi Publik**
  - Menampilkan aspirasi yang bersifat publik dengan filter kategori dan pencarian.
  - Upvote / Dukungan komunitas siswa dengan interaksi dinamis.

- **Panel Admin / Pengelola**
  - Autentikasi aman bagi tim kesiswaan / admin sekolah.
  - Statistik ringkas total pengaduan, status penyelesaian, dan sebaran kategori.
  - Pembaruan status penanganan dan tanggapan langsung ke siswa.
  - Ekspor laporan aspirasi ke format CSV.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Library UI**: [React](https://react.dev/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visual Feedback**: Canvas Confetti
- **Bahasa**: TypeScript

---

## 💻 Memulai Proyek

Jalankan perintah berikut untuk menginstal dependensi dan memulai server pengembangan:

```bash
# Instal dependensi
npm install

# Jalankan server lokal
npm run dev
```

Buka browser di [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 📦 Build Produksi

Untuk membuat build produksi yang teroptimasi:

```bash
npm run build
npm run start
```
