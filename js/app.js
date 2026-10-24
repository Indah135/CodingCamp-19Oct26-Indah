/**
 * Life Dashboard — app.js
 * Pure JavaScript, no dependencies. All data in Local Storage.
 */

'use strict';

/* =====================================================
   STORAGE KEYS
   ===================================================== */
const STORAGE_KEYS = {
  theme : 'ld_theme',
  name  : 'ld_username',
  todos : 'ld_todos',
  links : 'ld_links',
};

/* =====================================================
   UTILITIES
   ===================================================== */

/** Generate a simple unique ID */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Save data to Local Storage */
function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

/** Load data from Local Storage */
function load(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/** Normalise a URL — add https:// if missing */
function normaliseUrl(url) {
  url = url.trim();
  if (url && !/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

/** Extract domain for favicon */
function faviconUrl(url) {
  try {
    const u = new URL(normaliseUrl(url));
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=32`;
  } catch {
    return '';
  }
}

/** Show a temporary message then hide it after `ms` */
function showTempMessage(el, text, ms = 2500) {
  el.textContent = text;
  el.classList.remove('hidden');
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => el.classList.add('hidden'), ms);
}


/* =====================================================
   MODULE: THEME
   ===================================================== */
function initTheme() {
  const saved = load(STORAGE_KEYS.theme);
  // If no saved preference, use system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  save(STORAGE_KEYS.theme, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}


/* =====================================================
   MODULE: CLOCK & GREETING
   ===================================================== */

const MONTHS_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

const DAYS_ID = [
  'Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'
];

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return { text: 'Selamat Pagi',  emoji: '🌤️' };
  if (hour >= 12 && hour < 15) return { text: 'Selamat Siang', emoji: '☀️' };
  if (hour >= 15 && hour < 18) return { text: 'Selamat Sore',  emoji: '🌇' };
  if (hour >= 18 && hour < 21) return { text: 'Selamat Malam', emoji: '🌆' };
  return { text: 'Selamat Malam',  emoji: '🌙' };
}

function formatDate(date) {
  const day   = DAYS_ID[date.getDay()];
  const dd    = date.getDate();
  const month = MONTHS_ID[date.getMonth()];
  const yyyy  = date.getFullYear();
  return `${day}, ${dd} ${month} ${yyyy}`;
}

function pad2(n) { return String(n).padStart(2, '0'); }

function updateClock() {
  const now  = new Date();
  const hh   = pad2(now.getHours());
  const mm   = pad2(now.getMinutes());
  const ss   = pad2(now.getSeconds());

  document.getElementById('clockTime').textContent = `${hh}:${mm}:${ss}`;
  document.getElementById('clockDate').textContent = formatDate(now);

  // Update greeting text (excluding username part)
  const greetingEl = document.getElementById('greeting');
  const { text, emoji } = getGreeting(now.getHours());
  greetingEl.textContent = `${emoji} ${text}`;
}

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}


/* =====================================================
   MODULE: NAME EDITOR
   ===================================================== */
function initName() {
  renderName();

  document.getElementById('nameEditBtn').addEventListener('click', openNameEditor);
  document.getElementById('nameSaveBtn').addEventListener('click', saveNameFromInput);
  document.getElementById('nameCancelBtn').addEventListener('click', closeNameEditor);
  document.getElementById('nameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveNameFromInput();
    if (e.key === 'Escape') closeNameEditor();
  });
}

function renderName() {
  const name = load(STORAGE_KEYS.name, '');
  const display = document.getElementById('usernameDisplay');
  display.textContent = name ? name + '!' : '— siapa namamu?';
}

function openNameEditor() {
  const name = load(STORAGE_KEYS.name, '');
  document.getElementById('nameInput').value = name;
  document.getElementById('nameInputWrap').classList.remove('hidden');
  document.getElementById('nameInput').focus();
}

function closeNameEditor() {
  document.getElementById('nameInputWrap').classList.add('hidden');
}

function saveNameFromInput() {
  const val = document.getElementById('nameInput').value.trim();
  save(STORAGE_KEYS.name, val);
  renderName();
  closeNameEditor();
}


/* =====================================================
   MODULE: FOCUS TIMER
   ===================================================== */
const TIMER_DURATION = 25 * 60; // 1500 seconds
const CIRCUMFERENCE  = 2 * Math.PI * 88; // ≈ 552.92

let timerRemaining = TIMER_DURATION;
let timerRunning   = false;
let timerIntervalId = null;

function initTimer() {
  renderTimerDisplay(TIMER_DURATION);
  updateRingProgress(TIMER_DURATION);

  document.getElementById('timerStartBtn').addEventListener('click', startTimer);
  document.getElementById('timerStopBtn').addEventListener('click', pauseTimer);
  document.getElementById('timerResetBtn').addEventListener('click', resetTimer);
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;

  document.getElementById('timerStartBtn').disabled = true;
  document.getElementById('timerStopBtn').disabled  = false;
  document.getElementById('timerLabel').textContent = 'Sedang berjalan...';

  timerIntervalId = setInterval(timerTick, 1000);
}

function pauseTimer() {
  if (!timerRunning) return;
  timerRunning = false;
  clearInterval(timerIntervalId);

  document.getElementById('timerStartBtn').disabled = false;
  document.getElementById('timerStopBtn').disabled  = true;
  document.getElementById('timerLabel').textContent = 'Dijeda. Tekan Start untuk lanjut.';
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerIntervalId);
  timerRemaining = TIMER_DURATION;

  renderTimerDisplay(TIMER_DURATION);
  updateRingProgress(TIMER_DURATION);

  document.getElementById('timerStartBtn').disabled = false;
  document.getElementById('timerStopBtn').disabled  = true;
  document.getElementById('timerLabel').textContent = 'Fokus selama 25 menit';

  // Remove "done" style if any
  document.querySelector('.timer-ring-wrap').classList.remove('timer-done');
}

function timerTick() {
  timerRemaining--;
  renderTimerDisplay(timerRemaining);
  updateRingProgress(timerRemaining);

  if (timerRemaining <= 0) {
    timerComplete();
  }
}

function renderTimerDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  document.getElementById('timerDisplay').textContent = `${pad2(m)}:${pad2(s)}`;
}

function updateRingProgress(remaining) {
  const fraction = remaining / TIMER_DURATION;
  const offset   = CIRCUMFERENCE * (1 - fraction);
  document.getElementById('ringProgress').style.strokeDashoffset = offset.toFixed(2);
}

function timerComplete() {
  timerRunning = false;
  clearInterval(timerIntervalId);

  document.getElementById('timerStartBtn').disabled = false;
  document.getElementById('timerStopBtn').disabled  = true;
  document.getElementById('timerLabel').textContent = '🎉 Sesi fokus selesai!';

  // Visual feedback
  document.querySelector('.timer-ring-wrap').classList.add('timer-done');

  // Browser notification (if permitted)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Focus Timer', {
      body: '25 menit selesai! Waktunya istirahat.',
      icon: ''
    });
  } else {
    // Fallback alert
    setTimeout(() => {
      alert('⏰ Sesi fokus 25 menit selesai! Waktunya istirahat.');
    }, 100);
  }

  // Request permission for next time
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}


/* =====================================================
   MODULE: TO-DO LIST
   ===================================================== */

/** @type {Array<{id: string, text: string, done: boolean, createdAt: number}>} */
let todos = [];

function initTodo() {
  todos = loadTodos();
  renderTodos();

  const todoInput = document.getElementById('todoInput');
  const todoAddBtn = document.getElementById('todoAddBtn');

  todoAddBtn.addEventListener('click', handleAddTodo);
  todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddTodo();
  });
  todoInput.addEventListener('input', () => {
    // Hide duplicate message when user starts typing again
    document.getElementById('duplicateMsg').classList.add('hidden');
  });

  // Event delegation on the list
  document.getElementById('todoList').addEventListener('click', handleTodoListClick);
  document.getElementById('todoList').addEventListener('keydown', handleTodoListKeydown);
}

function handleAddTodo() {
  const input = document.getElementById('todoInput');
  const text  = input.value.trim();
  if (!text) return;

  if (isDuplicateTodo(text, null)) {
    showTempMessage(document.getElementById('duplicateMsg'), '⚠ Tugas ini sudah ada dalam daftar.', 3000);
    input.focus();
    input.select();
    return;
  }

  todos.unshift({ id: generateId(), text, done: false, createdAt: Date.now() });
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
  document.getElementById('duplicateMsg').classList.add('hidden');
}

/** Check for duplicates (case-insensitive). excludeId: skip when editing */
function isDuplicateTodo(text, excludeId) {
  const normalised = text.trim().toLowerCase();
  return todos.some(t => t.id !== excludeId && t.text.trim().toLowerCase() === normalised);
}

function handleTodoListClick(e) {
  const item = e.target.closest('[data-id]');
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.closest('.todo-checkbox')) {
    toggleTodo(id);
  } else if (e.target.closest('[data-action="delete"]')) {
    deleteTodo(id);
  } else if (e.target.closest('[data-action="edit"]')) {
    startEditTodo(id);
  } else if (e.target.closest('[data-action="save-edit"]')) {
    commitEditTodo(id);
  } else if (e.target.closest('[data-action="cancel-edit"]')) {
    renderTodos(); // re-render to cancel
  }
}

function handleTodoListKeydown(e) {
  const item = e.target.closest('[data-id]');
  if (!item) return;
  const id = item.dataset.id;

  if (e.target.classList.contains('todo-edit-input')) {
    if (e.key === 'Enter')  { e.preventDefault(); commitEditTodo(id); }
    if (e.key === 'Escape') { renderTodos(); }
  }
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function startEditTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const item = document.querySelector(`[data-id="${id}"]`);
  if (!item) return;

  // Replace text span with input
  const textEl = item.querySelector('.todo-text');
  textEl.outerHTML = `<input
    type="text"
    class="todo-edit-input"
    value="${escapeHtml(todo.text)}"
    maxlength="100"
    autocomplete="off"
  />`;

  // Replace action buttons
  const actionsEl = item.querySelector('.todo-actions');
  actionsEl.innerHTML = `
    <button class="btn btn-sm btn-accent" data-action="save-edit" title="Simpan">✓</button>
    <button class="btn btn-sm btn-ghost"  data-action="cancel-edit" title="Batal">✕</button>
  `;

  // Focus input
  const editInput = item.querySelector('.todo-edit-input');
  editInput.focus();
  editInput.select();
}

function commitEditTodo(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (!item) return;
  const editInput = item.querySelector('.todo-edit-input');
  if (!editInput) return;

  const newText = editInput.value.trim();
  if (!newText) { renderTodos(); return; }

  if (isDuplicateTodo(newText, id)) {
    showTempMessage(document.getElementById('duplicateMsg'), '⚠ Tugas ini sudah ada dalam daftar.', 3000);
    editInput.focus();
    return;
  }

  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.text = newText;
    saveTodos();
  }
  renderTodos();
  document.getElementById('duplicateMsg').classList.add('hidden');
}

function renderTodos() {
  const list  = document.getElementById('todoList');
  const stats = document.getElementById('todoStats');

  if (todos.length === 0) {
    list.innerHTML = `<li class="links-empty">Belum ada tugas. Tambahkan sekarang!</li>`;
    stats.textContent = '';
    return;
  }

  const doneCount = todos.filter(t => t.done).length;
  stats.textContent = `${doneCount} / ${todos.length} tugas selesai`;

  list.innerHTML = todos.map(todo => `
    <li class="todo-item${todo.done ? ' done' : ''}" data-id="${todo.id}">
      <span class="todo-checkbox${todo.done ? ' checked' : ''}" title="${todo.done ? 'Tandai belum selesai' : 'Tandai selesai'}"></span>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="btn-icon-only" data-action="edit" title="Edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon-only" data-action="delete" title="Hapus" style="color: var(--danger)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </li>
  `).join('');
}

function loadTodos() {
  return load(STORAGE_KEYS.todos, []);
}

function saveTodos() {
  save(STORAGE_KEYS.todos, todos);
}


/* =====================================================
   MODULE: QUICK LINKS
   ===================================================== */

/** @type {Array<{id: string, name: string, url: string}>} */
let links = [];

function initLinks() {
  links = loadLinks();
  renderLinks();

  document.getElementById('linkAddBtn').addEventListener('click', handleAddLink);
  document.getElementById('linkUrlInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAddLink();
  });
  document.getElementById('linkNameInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('linkUrlInput').focus();
  });

  // Event delegation for delete
  document.getElementById('linksGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="delete-link"]');
    if (btn) {
      e.preventDefault(); // don't follow the <a> href
      e.stopPropagation();
      deleteLink(btn.dataset.id);
    }
  });
}

function handleAddLink() {
  const nameInput = document.getElementById('linkNameInput');
  const urlInput  = document.getElementById('linkUrlInput');
  const errorEl   = document.getElementById('linkError');

  const name = nameInput.value.trim();
  let   url  = urlInput.value.trim();

  if (!name) {
    showTempMessage(errorEl, '⚠ Nama situs tidak boleh kosong.', 3000);
    nameInput.focus();
    return;
  }

  if (!url) {
    showTempMessage(errorEl, '⚠ URL tidak boleh kosong.', 3000);
    urlInput.focus();
    return;
  }

  url = normaliseUrl(url);

  try {
    new URL(url); // Validate URL
  } catch {
    showTempMessage(errorEl, '⚠ URL tidak valid. Contoh: https://google.com', 3000);
    urlInput.focus();
    return;
  }

  links.push({ id: generateId(), name, url });
  saveLinks();
  renderLinks();

  nameInput.value = '';
  urlInput.value  = '';
  errorEl.classList.add('hidden');
  nameInput.focus();
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}

function renderLinks() {
  const grid = document.getElementById('linksGrid');

  if (links.length === 0) {
    grid.innerHTML = `<div class="links-empty">Belum ada link. Tambahkan situs favoritmu!</div>`;
    return;
  }

  grid.innerHTML = links.map(link => `
    <a
      href="${escapeHtml(link.url)}"
      target="_blank"
      rel="noopener noreferrer"
      class="link-card"
      title="${escapeHtml(link.url)}"
    >
      <img
        class="link-favicon"
        src="${escapeHtml(faviconUrl(link.url))}"
        alt=""
        width="32"
        height="32"
        loading="lazy"
        onerror="this.style.display='none'"
      />
      <span class="link-name">${escapeHtml(link.name)}</span>
      <button
        class="link-delete-btn"
        data-action="delete-link"
        data-id="${link.id}"
        title="Hapus link"
        aria-label="Hapus ${escapeHtml(link.name)}"
      >✕</button>
    </a>
  `).join('');
}

function loadLinks() {
  return load(STORAGE_KEYS.links, []);
}

function saveLinks() {
  save(STORAGE_KEYS.links, links);
}


/* =====================================================
   BOOTSTRAP
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initClock();
  initName();
  initTimer();
  initTodo();
  initLinks();
});
