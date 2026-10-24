# Life Dashboard — Design

## Arsitektur

```
index.html          ← struktur HTML (shell)
css/
  style.css         ← semua gaya, termasuk variabel CSS untuk theme
js/
  app.js            ← semua logika JavaScript
```

Tidak ada dependensi npm. Satu-satunya sumber eksternal adalah Google Fonts.

---

## Struktur HTML

```
<body data-theme="light|dark">
  <header>          ← greeting, jam, tanggal, dark mode toggle
  <main>
    ├── .widget-timer      ← focus timer
    ├── .widget-todo       ← to-do list
    └── .widget-links      ← quick links
  <footer>          ← minimal
```

Layout utama: CSS Grid 2 kolom di desktop, 1 kolom di mobile.

---

## CSS Architecture

### Variabel (Custom Properties)
```css
:root {
  /* Light */
  --bg-primary, --bg-secondary, --bg-card
  --text-primary, --text-secondary, --text-muted
  --accent, --accent-hover
  --border, --shadow
  --timer-ring
}

[data-theme="dark"] {
  /* override semua variabel di atas */
}
```

### Komponen Utama
- `.header` — flex row, space-between
- `.greeting` — nama + waktu
- `.widget` — card dengan shadow, border-radius, padding
- `.timer-display` — jam besar + progress circle (SVG)
- `.todo-input` — input + button row
- `.todo-item` — flex row dengan checkbox, teks, tombol aksi
- `.links-grid` — grid wrap kartu link
- `.theme-toggle` — button bulat di sudut kanan atas

---

## JavaScript Modules (dalam satu file app.js)

### State & Storage
```js
const STORAGE_KEYS = {
  theme: 'ld_theme',
  name:  'ld_username',
  todos: 'ld_todos',
  links: 'ld_links'
}
```

### Modul: Clock
- `initClock()` — jalankan setInterval 1 detik
- `updateClock()` — update DOM jam, tanggal, salam
- `getGreeting(hour)` — return string salam

### Modul: NameEditor
- `initName()` — load dari storage, pasang event listener klik
- `saveName(name)` — simpan ke storage, update greeting

### Modul: Timer
- State: `totalSeconds=1500`, `remaining`, `isRunning`, `intervalId`
- `initTimer()` — render, pasang event listener tombol
- `startTimer()`, `pauseTimer()`, `resetTimer()`
- `tick()` — kurangi remaining, update display & progress
- `onComplete()` — notifikasi, reset state
- Progress circle: SVG `<circle>` dengan `stroke-dashoffset`

### Modul: TodoList
- State: array of `{ id, text, done, createdAt }`
- `initTodo()` — load storage, render, pasang event
- `addTodo(text)` — cek duplikat, push, save, render
- `toggleTodo(id)` — toggle done, save, render
- `deleteTodo(id)` — filter, save, render
- `editTodo(id, newText)` — cek duplikat, update, save, render
- `isDuplicate(text, excludeId)` — return boolean
- `saveTodos()`, `loadTodos()`, `renderTodos()`

### Modul: QuickLinks
- State: array of `{ id, name, url }`
- `initLinks()` — load storage, render, pasang event
- `addLink(name, url)` — push, save, render
- `deleteLink(id)` — filter, save, render
- `saveLinks()`, `loadLinks()`, `renderLinks()`

### Modul: Theme
- `initTheme()` — load dari storage atau deteksi sistem
- `toggleTheme()` — switch, save, update `data-theme`

### Bootstrap
```js
document.addEventListener('DOMContentLoaded', () => {
  initTheme()
  initClock()
  initName()
  initTimer()
  initTodo()
  initLinks()
})
```

---

## Data Schema (Local Storage)

```json
// ld_todos
[
  { "id": "uuid", "text": "string", "done": false, "createdAt": 1234567890 }
]

// ld_links
[
  { "id": "uuid", "name": "string", "url": "https://..." }
]

// ld_theme → "light" | "dark"
// ld_username → "string"
```

---

## Palette Warna

| Token          | Light          | Dark           |
|----------------|----------------|----------------|
| bg-primary     | #f8f9fa        | #0f172a        |
| bg-card        | #ffffff        | #1e293b        |
| text-primary   | #1a1a2e        | #f1f5f9        |
| accent         | #6366f1        | #818cf8        |
| border         | #e2e8f0        | #334155        |

---

## Responsivitas

- Desktop (≥768px): Grid 2 kolom — timer kiri, todo kanan, links full-width bawah
- Mobile (<768px): Stack vertikal, padding lebih kecil
