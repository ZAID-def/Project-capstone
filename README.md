# Sistem Aspirasi & Pengaduan Guru dan Pegawai SMK IT Baitul Aziz

Platform modern dan terpadu untuk penyampaian, pelacakan, dan pengelolaan aspirasi serta masukan operasional bagi Dewan Guru (Tenaga Pendidik) dan Pegawai (Tenaga Kependidikan) SMK IT Baitul Aziz berbasis web dengan klasifikasi otomatis (NLP/AI), sistem tiket unik, katalog aspirasi terverifikasi, dan dashboard admin manajemen sekolah.

---

## 🚀 Fitur Utama

- **Penyampaian Aspirasi Khusus Stakeholder Pendidik & Tendik**
  - Khusus untuk 2 stakeholder utama: **Guru** (Tenaga Pendidik) dan **Pegawai** (Tenaga Kependidikan).
  - Prediksi kategori dan urgensi otomatis secara real-time berbasis NLP lokal (*Keyword & Sentiment Matcher*).
  - Opsi pelaporan terbuka, privat, maupun anonim dengan jaminan kerahasiaan.
  - Form identitas dinamis (NIP/NUPTK untuk guru, NIP/NIPTT/Unit Kerja untuk pegawai).
  - Unggah lampiran foto/bukti kendala sarpras dan pendukung.
  - Generator kode tiket unik untuk pelacakan langsung.

- **Pelacakan Tiket (Tracking System)**
  - Cek progres status aspirasi (Terkirim, Diverifikasi, Didisposisi, Ditindaklanjuti, Selesai, Ditolak).
  - Riwayat interaktif timeline status dan penugasan unit penanggung jawab.
  - Diskusi 2 arah langsung antara pelapor dan pihak manajemen sekolah.

- **Katalog Aspirasi Publik Terverifikasi**
  - Menampilkan aspirasi yang bersifat terbuka dengan filter kategori, status, dan pencarian.
  - Identifikasi stakeholder pelapor (Guru / Pegawai) secara transparan.

- **Panel Manajemen / Admin Petugas**
  - Autentikasi aman bagi tim manajemen/petugas sekolah.
  - Filter cepat berdasarkan Kategori, Status, Tingkat Urgensi, dan Stakeholder (Guru / Pegawai).
  - Disposisi tiket ke waka/unit terkait (Sarpras, Kurikulum, Kesiswaan, TU, Hubin).
  - Komunikasi dua arah dan pencatatan nota internal (*internal notes*).

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
