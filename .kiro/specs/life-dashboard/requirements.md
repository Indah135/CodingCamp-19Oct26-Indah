# Life Dashboard — Requirements

## Overview
Sebuah web app dashboard produktivitas personal yang berjalan sepenuhnya di browser,
tanpa backend. Semua data persisten menggunakan Local Storage.

---

## Batasan Teknis

- Hanya HTML, CSS, dan JavaScript murni (tanpa framework)
- Tanpa backend — semua data di Local Storage
- Struktur file: `index.html`, `css/style.css`, `js/app.js`
- Berjalan di browser modern: Chrome, Firefox, Edge, Safari

---

## Fitur Wajib (MVP)

### REQ-1: Salam & Informasi Waktu
- MUST: Tampilkan jam saat ini (format HH:MM:SS) yang diperbarui setiap detik
- MUST: Tampilkan tanggal saat ini (format hari, DD Bulan YYYY dalam Bahasa Indonesia)
- MUST: Ucapan sesuai waktu: Selamat Pagi (05–11), Siang (12–14), Sore (15–17), Malam (18–04)

### REQ-2: Nama Khusus di Salam (Tantangan)
- MUST: Pengguna bisa mengisi nama, disimpan di Local Storage
- MUST: Salam menampilkan nama jika sudah diisi, misal "Selamat Pagi, Andi!"
- MUST: Klik pada nama untuk mengedit

### REQ-3: Focus Timer (Pomodoro 25 Menit)
- MUST: Timer mundur dari 25:00
- MUST: Tombol Start, Stop (pause), dan Reset
- MUST: Notifikasi/alert ketika timer selesai
- SHOULD: Tampilkan progress visual (progress bar atau lingkaran)

### REQ-4: To-Do List
- MUST: Tambah tugas baru via input + tombol atau tekan Enter
- MUST: Tandai tugas selesai (checkbox / klik)
- MUST: Hapus tugas individual
- MUST: Edit tugas yang sudah ada (double-click atau tombol edit)
- MUST: Semua data disimpan di Local Storage
- MUST: Cegah tugas duplikat — tampilkan pesan jika tugas dengan nama sama sudah ada (Tantangan)
- SHOULD: Tampilkan jumlah tugas selesai vs total

### REQ-5: Quick Links
- MUST: Tampilkan daftar link favorit sebagai tombol/kartu
- MUST: Tambah link baru (nama + URL)
- MUST: Hapus link
- MUST: Klik link membuka di tab baru
- MUST: Semua data disimpan di Local Storage

### REQ-6: Mode Terang/Gelap (Tantangan)
- MUST: Toggle antara light mode dan dark mode
- MUST: Simpan preferensi di Local Storage dan terapkan otomatis saat halaman dimuat
- MUST: Ikon toggle yang jelas (matahari/bulan)

---

## Non-Fungsional

- Antarmuka bersih dan minimalis
- Load cepat (tidak ada dependensi eksternal kecuali Google Fonts)
- UI responsif (mobile-friendly, breakpoint utama 768px)
- Hierarki visual jelas (heading, card, spacing konsisten)
- Tipografi mudah dibaca (sans-serif, ukuran memadai)
- Transisi/animasi halus untuk interaksi UI
