# Life Dashboard — Tasks

## Task 1: Setup Struktur Proyek ✅
- [x] Buat direktori `css/` dan `js/`
- [x] Buat file `css/style.css` dan `js/app.js`
- [x] Tulis shell HTML di `index.html` (head, meta, link ke CSS/JS, struktur widget)

## Task 2: CSS — Variables, Reset, Layout ✅
- [x] Definisikan CSS custom properties untuk light dan dark theme
- [x] CSS reset / base styles
- [x] Layout utama: header + main grid + footer
- [x] Tipografi dan spacing dasar

## Task 3: CSS — Komponen Widget ✅
- [x] Style `.widget` card
- [x] Style header (greeting, jam, dark mode toggle)
- [x] Style timer display (angka besar, SVG progress ring)
- [x] Style todo list (input, item, checkbox, tombol)
- [x] Style quick links (grid kartu)

## Task 4: CSS — Responsivitas & Dark Mode ✅
- [x] Media query untuk mobile (<768px & <600px & <400px)
- [x] Transisi untuk dark/light mode
- [x] Animasi hover pada tombol dan kartu link

## Task 5: JS — Fondasi & Utilitas ✅
- [x] Definisikan STORAGE_KEYS
- [x] Fungsi `generateId()`
- [x] Fungsi `save(key, data)` dan `load(key, fallback)`
- [x] Fungsi `escapeHtml(str)` untuk keamanan

## Task 6: JS — Modul Clock & Greeting ✅
- [x] `getGreeting(hour)` — return salam Bahasa Indonesia
- [x] `formatDate()` — tanggal dalam Bahasa Indonesia
- [x] `updateClock()` — update DOM setiap detik
- [x] `initClock()` — mulai interval

## Task 7: JS — Modul Name Editor ✅
- [x] `initName()` — load dari storage, render nama di greeting
- [x] Event klik nama → tampilkan input inline
- [x] `saveName()` — simpan ke storage, update tampilan

## Task 8: JS — Modul Theme ✅
- [x] `initTheme()` — apply theme dari storage atau prefers-color-scheme
- [x] `toggleTheme()` — switch theme, update icon, simpan ke storage

## Task 9: JS — Modul Focus Timer ✅
- [x] State timer (remaining, isRunning, intervalId)
- [x] `initTimer()` — render awal, pasang event listener
- [x] `startTimer()`, `pauseTimer()`, `resetTimer()`
- [x] `tick()` — update display + progress ring SVG
- [x] `onComplete()` — notifikasi browser / alert

## Task 10: JS — Modul To-Do List ✅
- [x] `loadTodos()`, `saveTodos()`
- [x] `renderTodos()` — render semua item ke DOM
- [x] `addTodo(text)` — validasi kosong + cek duplikat
- [x] `toggleTodo(id)` — toggle done
- [x] `deleteTodo(id)` — hapus item
- [x] `editTodo(id)` — inline edit dengan cek duplikat
- [x] Event delegation untuk semua aksi

## Task 11: JS — Modul Quick Links ✅
- [x] `loadLinks()`, `saveLinks()`
- [x] `renderLinks()` — render kartu link
- [x] Form tambah link (nama + URL, validasi)
- [x] `addLink()`, `deleteLink()`
- [x] Event delegation

## Task 12: Verifikasi & Polish ✅
- [x] Semua required ID ada di HTML
- [x] CSS dengan 734 baris — semua komponen terdefinisi
- [x] JS dengan 46 fungsi — semua modul lengkap
- [x] Struktur file sesuai spesifikasi
