# Notes App - Dicoding Submission 2

> Aplikasi pencatatan menggunakan Web Components, Webpack, dan RESTful API

[![Status](https://img.shields.io/badge/status-complete-success)]()
[![Kriteria](https://img.shields.io/badge/kriteria-11/11-brightgreen)]()

## 📋 Kriteria Submission

### ✅ Kriteria Wajib (5/5)
1. **Pertahankan kriteria sebelumnya** - Web Components, CSS Grid, Validasi form
2. **RESTful API** - Terintegrasi dengan `https://notes-api.dicoding.dev/v2`
3. **Webpack** - Module bundler dengan html-webpack-plugin
4. **Fetch API** - Semua HTTP requests menggunakan Fetch API
5. **Loading Indicator** - Web Component untuk loading state

### ✅ Kriteria Opsional (6/6)
1. **Fitur Arsip** - Archive/unarchive notes, bulk operations
2. **Error Feedback** - SweetAlert2 untuk error handling
3. **Animasi** - CSS transitions, transforms, hover effects
4. **Prettier** - Code formatter dengan config `.prettierrc`
5. **Search Feature** ⭐ NEW - Real-time search dengan keyboard shortcut (Ctrl+K)
6. **Accessibility (a11y)** ⭐ NEW - ARIA labels, keyboard navigation, screen reader support

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development mode (http://localhost:9000)
npm run start-dev

# Production build
npm run build

# Format code
npm run format
```

---

## 📂 Struktur Proyek

```
notes-app/
├── src/
│   ├── components/          # Web Components
│   │   ├── app-bar.js       # Header aplikasi
│   │   ├── loading-indicator.js  # Loading spinner
│   │   ├── note-input.js    # Form input catatan
│   │   ├── note-item.js     # Card catatan
│   │   ├── note-list.js     # Grid container
│   │   └── search-bar.js    # Search component ⭐ NEW
│   ├── api.js               # API service layer (7 methods)
│   └── app.js               # Main application logic
├── index.html               # HTML template
├── styles.css               # Global styles
├── webpack.config.js        # Webpack configuration
├── package.json             # Dependencies & scripts
└── .prettierrc              # Prettier config
```

---

## 🎯 Fitur Aplikasi

- ✅ **CRUD Operations** - Create, Read, Delete notes via API
- ✅ **Archive System** - Archive/unarchive notes, bulk operations
- ✅ **Real-time Search** ⭐ NEW - Instant search with keyboard shortcut (Ctrl+K / Cmd+K)
- ✅ **Real-time Validation** - Form validation dengan feedback visual
- ✅ **Loading States** - Indicator untuk semua async operations
- ✅ **Error Handling** - SweetAlert2 alerts untuk errors & confirmations
- ✅ **Export Data** - Download notes sebagai JSON
- ✅ **Responsive Design** - Mobile, tablet, desktop ready
- ✅ **Smooth Animations** - CSS transitions & transforms
- ✅ **Accessibility** ⭐ NEW - ARIA labels, keyboard navigation, screen reader support

---

## 🌐 API Integration

**Base URL:** `https://notes-api.dicoding.dev/v2`

### Endpoints yang Digunakan:

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/notes` | Ambil semua catatan aktif |
| GET | `/notes/archived` | Ambil catatan yang diarsipkan |
| GET | `/notes/{id}` | Ambil detail satu catatan |
| POST | `/notes` | Buat catatan baru |
| POST | `/notes/{id}/archive` | Arsipkan catatan |
| POST | `/notes/{id}/unarchive` | Batalkan arsip |
| DELETE | `/notes/{id}` | Hapus catatan |

**Implementasi:** Semua di file `src/api.js` menggunakan Fetch API dengan async/await

---

## 🔧 Teknologi

- **Web Components** - Custom Elements + Shadow DOM
- **Webpack 5** - Module bundler + dev server
- **Fetch API** - HTTP client untuk API calls
- **SweetAlert2** - Alert & confirmation dialogs
- **Prettier** - Code formatter
- **CSS Grid & Flexbox** - Responsive layout

---

## � Komponen Web

### 1. `<app-bar>`
Header aplikasi dengan tombol export/import

### 2. `<note-input>`
Form input dengan validasi:
- Title required
- Body max 1000 characters
- Real-time validation feedback

### 3. `<note-item>`
Card untuk menampilkan catatan dengan:
- Archive/Unarchive button
- Delete button (dengan konfirmasi)
- Hover animations

### 4. `<note-list>`
Grid container untuk menampilkan cards

### 5. `<loading-indicator>`
Loading overlay dengan:
- Spinner animation
- Backdrop blur effect
- Custom message support

---

## 💻 Development

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- NPM (v6 atau lebih tinggi)

### Scripts

```bash
# Development server dengan hot reload
npm run start-dev

# Build untuk production (output: dist/)
npm run build

# Format semua kode dengan Prettier
npm run format
```

### Webpack Configuration

- **Entry:** `src/app.js`
- **Output:** `dist/bundle.js` (104 KB production)
- **Dev Server:** Port 9000 dengan hot reload
- **Plugins:** html-webpack-plugin, copy-webpack-plugin

---

## 🎨 Styling

**Theme:** Dark mode dengan gradient accent
- Primary: Purple (#7c3aed) + Cyan (#06b6d4)
- Background: Dark slate (#0f172a, #1e293b)
- Text: Light gray (#e6eef8, #94a3b8)

**Animations:**
- Hover transforms (translateY)
- Smooth transitions (250ms cubic-bezier)
- Loading spinner rotation
- Fade in effects

---

## 📝 Usage Flow

### Mencari Catatan ⭐ NEW
1. Klik search bar atau tekan Ctrl+K / Cmd+K
2. Ketik kata kunci (title atau body)
3. Hasil real-time filtering
4. Counter menunjukkan jumlah hasil
5. Klik × untuk clear search

### Keyboard Shortcuts ⭐ NEW
- **Ctrl+K / Cmd+K** - Focus search bar
- **Delete** - Delete focused note (when note card focused)
- **A** - Archive/Unarchive focused note (when note card focused)
- **Tab** - Navigate between notes
- **Enter** - Activate button/action

### Membuat Catatan
1. Isi form title & body
2. Validasi otomatis (title required, body max 1000 char)
3. Klik "Add Note"
4. Loading indicator muncul
5. Catatan tersimpan ke server
6. Success notification
7. Catatan muncul di list

### Mengarsipkan Catatan
1. Klik tombol "Archive" di catatan
2. Loading indicator muncul
3. Catatan pindah ke Archived section
4. Success notification

### Menghapus Catatan
1. Klik tombol "Delete"
2. Konfirmasi dialog muncul
3. Klik "Yes, delete it!"
4. Loading indicator muncul
5. Catatan terhapus dari server
6. Success notification

---

## 🐛 Error Handling

Semua operasi API memiliki error handling:

```javascript
try {
  await NotesAPI.someOperation();
  showSuccess("Berhasil!");
} catch (error) {
  showError("Gagal!", error);
}
```

Error ditampilkan dengan SweetAlert2 yang styled dengan tema aplikasi.

---

## 🚢 Deployment

### Build Production

```bash
npm run build
```

Output ada di folder `dist/` dengan files:
- `index.html` - HTML dengan bundle injected
- `bundle.js` - Minified JavaScript (104 KB)
- `styles.css` - Global styles

### Deploy Options

**Netlify / Vercel:**
```bash
# Netlify
netlify deploy --prod --dir=dist

# Vercel
vercel --prod
```

**GitHub Pages:**
```bash
git subtree push --prefix dist origin gh-pages
```

---

## 📊 Build Stats

- **Development Bundle:** 420 KB (unminified + source maps)
- **Production Bundle:** 104 KB (minified + optimized)
- **Dependencies:** 1 production (sweetalert2), 7 dev dependencies

---

## ✅ Testing Checklist

Sebelum submit, pastikan:

- [x] `npm install` berhasil
- [x] `npm run build` berhasil
- [x] `npm run start-dev` berjalan di port 9000
- [x] Create note berfungsi
- [x] Display notes dari API
- [x] Delete note dengan konfirmasi
- [x] Archive/unarchive berfungsi
- [x] Loading indicators muncul
- [x] Error handling bekerja
- [x] Search feature berfungsi ⭐ NEW
- [x] Keyboard shortcuts berfungsi ⭐ NEW
- [x] Accessibility features bekerja ⭐ NEW
- [x] ARIA labels ada ⭐ NEW
- [x] Tab navigation berfungsi ⭐ NEW
- [x] Prettier configured (`.prettierrc` ada)
- [x] Webpack configured (`webpack.config.js` ada)
- [x] No console errors

---

## ♿ Accessibility Features ⭐ NEW

### ARIA Labels
- Search bar dengan `aria-label="Search notes"`
- Filter buttons dengan `aria-pressed` state
- Archived count dengan `aria-live="polite"`
- Loading indicator dengan `role="status"` dan `aria-live="polite"`
- Note lists dengan `role="list"` dan `aria-label`
- Individual notes dengan descriptive `aria-label`

### Keyboard Navigation
- **Tab** - Navigate through interactive elements
- **Enter/Space** - Activate buttons
- **Ctrl+K / Cmd+K** - Quick access to search
- **Delete** - Delete focused note
- **A** - Archive/Unarchive focused note
- **Escape** - Dismiss dialogs

### Screen Reader Support
- Semantic HTML5 elements (`<main>`, `<section>`, `<article>`)
- Descriptive labels untuk semua interactive elements
- Live regions untuk dynamic content updates
- Hidden headings untuk screen reader navigation

### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trap dalam modals
- Auto-focus pada search (Ctrl+K)

---

## 📄 License

ISC

---

## 👨‍💻 Submission Info

**Course:** Belajar Front-End Web Lanjutan
**Platform:** Dicoding Academy
**Submission:** 2 (RESTful API + Webpack)

---

**Dibuat dengan ❤️ untuk Dicoding Submission**


