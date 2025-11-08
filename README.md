# Notes App - Dicoding Submission 2

> Aplikasi pencatatan menggunakan Web Components, Webpack, dan RESTful API

[![Status](https://img.shields.io/badge/status-complete-success)]()
[![Kriteria](https://img.shields.io/badge/kriteria-11/11-brightgreen)]()
[![Code Quality](https://img.shields.io/badge/ESLint-passing-brightgreen)]()
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-ff69b4)]()
[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://notesapp-dev.vercel.app/)

## 🌐 Live Demo

**🚀 [https://notesapp-dev.vercel.app/](https://notes-apps-dev.vercel.app/)**

Aplikasi sudah di-deploy di Vercel dan siap digunakan! Coba semua fitur-fiturnya:
- ✅ Create, Archive, Delete notes
- ✅ Real-time search (Ctrl+K)
- ✅ Export/Import data
- ✅ Keyboard shortcuts
- ✅ Responsive design

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
# 1. Install dependencies
npm install

# 2. Development mode (http://localhost:9000)
npm run start-dev

# 3. Check code quality
npm run lint

# 4. Production build
npm run build
```

### 📦 Available Commands

| Command | Deskripsi |
|---------|-----------|
| `npm run start-dev` | Development server (port 9000) dengan webpack.dev.js |
| `npm run build` | Production build → `dist/` dengan webpack.prod.js |
| `npm run lint` | Check code quality (ESLint) |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code (Prettier) |
| `npm run lint:check` | Check ESLint + Prettier |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code (Prettier) |
| `npm run lint:check` | Check ESLint + Prettier |

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

### Core Features
- ✅ **CRUD Operations** - Create, Read, Update, Delete notes via API
- ✅ **Archive System** - Archive/unarchive notes, bulk operations
- ✅ **Real-time Search** - Instant search with keyboard shortcut (Ctrl+K / Cmd+K)
- ✅ **Real-time Validation** - Form validation dengan feedback visual
- ✅ **Loading States** - Indicator untuk semua async operations
- ✅ **Error Handling** - SweetAlert2 alerts untuk errors & confirmations
- ✅ **Export Data** - Download notes sebagai JSON
- ✅ **Responsive Design** - Mobile, tablet, desktop ready
- ✅ **Smooth Animations** - CSS transitions & transforms

### 🌟 Advanced Features (NEW!)
- ✅ **Edit Note** 🔥 - Edit existing notes with modal dialog
- ✅ **Note Detail View** 🔥 - Full-page view untuk membaca catatan lengkap
- ✅ **Dark/Light Mode Toggle** 🔥 - Theme switcher dengan localStorage persistence
- ✅ **PWA Support** 🔥 - Progressive Web App, installable & offline capable
- ✅ **Service Worker** 🔥 - Caching untuk offline functionality
- ✅ **Accessibility (a11y)** - ARIA labels, keyboard navigation, screen reader support

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
- **Webpack 5** - Module bundler + dev server dengan split config (common/dev/prod)
- **Fetch API** - HTTP client untuk API calls
- **SweetAlert2** - Alert & confirmation dialogs
- **Prettier** - Code formatter
- **ESLint** - Linter dengan Airbnb style guide
- **CSS Grid & Flexbox** - Responsive layout
- **CSS Variables** - Dynamic theming (dark/light mode)
- **Service Worker** 🔥 NEW - Offline caching & PWA support
- **Font Awesome** - Icon library untuk UI enhancement

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

# Lint kode dengan ESLint (Airbnb style guide) ⭐ NEW
npm run lint

# Auto-fix ESLint issues ⭐ NEW
npm run lint:fix

# Check kode quality (ESLint + Prettier) ⭐ NEW
npm run lint:check
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
- `bundle.js` - Minified JavaScript (109 KB)
- `styles.css` - Global styles

### Deploy to Vercel ⭐ RECOMMENDED

**Otomatis via GitHub:**
1. Push kode ke GitHub repository
2. Import project di [vercel.com](https://vercel.com)
3. Vercel akan otomatis detect settings dari `vercel.json`
4. Deploy! ✅

**Manual via CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

**Configuration:** `vercel.json` sudah configured dengan:
- Build Command: `npm run build`
- Output Directory: `dist`
- SPA routing support

### Deploy to Netlify

**Otomatis via GitHub:**
1. Push kode ke GitHub
2. Connect repository di [netlify.com](https://netlify.com)
3. Build settings otomatis dari `netlify.toml`
4. Deploy! ✅

**Manual via CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Configuration:** `netlify.toml` sudah configured dengan:
- Build Command: `npm run build`
- Publish Directory: `dist`

### Deploy Options Lainnya

**Method 1: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Method 2: GitHub Integration**
1. Push repository ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Vercel akan auto-detect `vercel.json` configuration
4. Deploy otomatis setiap push ke main branch

**Configuration:**
File `vercel.json` sudah configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
```

### Deploy to Netlify

**Netlify CLI:**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Deploy to GitHub Pages
```bash
git subtree push --prefix dist origin gh-pages
```

---

## � Pre-Deployment Verification

Sebelum deploy, jalankan verification script untuk memastikan semua siap:

```powershell
# PowerShell (Windows)
.\verify-deployment.ps1

# Bash (Linux/Mac)
bash verify-deployment.sh
```

Script ini akan check:
- ✅ node_modules installed
- ✅ dist folder exists
- ✅ vercel.json/netlify.toml configured
- ✅ ESLint passing
- ✅ Build successful
- ✅ All required files in dist/

**📚 Untuk panduan deployment lengkap, baca:** `DEPLOYMENT.md`

---

## �🔧 Deployment Troubleshooting

### ❌ Vercel Error: "No Output Directory named 'public' found"

**Penyebab:** Vercel default mencari folder `public`, tapi webpack output ke `dist`

**✅ Solusi:** 
- File `vercel.json` sudah configured dengan benar:
  ```json
  {
    "outputDirectory": "dist"
  }
  ```
- Pastikan `vercel.json` ada di root project
- Jika masih error, set di Vercel Dashboard → Project Settings → Build & Development Settings → Output Directory → `dist`

### ❌ 404 Error on Page Refresh (SPA Routing)

**Penyebab:** Server tidak redirect semua routes ke `index.html`

**✅ Solusi:**
- **Vercel:** `vercel.json` sudah configured dengan routes
- **Netlify:** `netlify.toml` sudah configured dengan redirects
- **GitHub Pages:** Tambahkan `404.html` yang sama dengan `index.html`

### ❌ Build Failed on Deploy

**✅ Checklist:**
1. Run `npm run build` locally terlebih dahulu
2. Pastikan tidak ada error di `npm run lint`
3. Check Node.js version (min v14)
4. Verify `package.json` scripts ada
5. Clear cache dan rebuild

### ❌ CSS Tidak Muncul di Vercel/Netlify

**Penyebab:** Path CSS di HTML menggunakan `./styles.css` yang tidak bekerja di production

**✅ Solusi:**
- Path sudah diperbaiki menjadi `styles.css` (tanpa `./`)
- File `styles.css` akan di-copy otomatis oleh webpack ke folder `dist/`
- Rebuild project: `npm run build`
- Redeploy ke Vercel/Netlify

**Verifikasi:**
```bash
# Check if styles.css exists in dist
ls dist
# Should show: index.html, bundle.js, styles.css
```

### ❌ API CORS Error

**✅ Solusi:**
- Notes API sudah support CORS
- Jika masih error, check browser console untuk detail
- Verify API endpoint: `https://notes-api.dicoding.dev/v2`

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
- [x] `npm run lint` passing tanpa error ⭐ NEW
- [x] `npm run format` berhasil format kode ⭐ NEW
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
- [x] ESLint configured dengan Airbnb style ⭐ NEW
- [x] Prettier configured (`.prettierrc` ada)
- [x] Webpack configured (`webpack.config.js` ada)
- [x] No console errors

---

## 🎯 Code Quality & Best Practices ⭐ NEW

### ESLint Configuration
Proyek ini menggunakan **ESLint** dengan **Airbnb JavaScript Style Guide** untuk memastikan kualitas kode yang konsisten.

**Benefits:**
- ✅ Deteksi error lebih awal sebelum runtime
- ✅ Konsistensi penulisan kode di seluruh proyek
- ✅ Best practices enforcement
- ✅ Menghindari common pitfalls
- ✅ Integrasi dengan Prettier untuk formatting

**Configuration Files:**
- `.eslintrc.js` - ESLint rules & configuration
- `.eslintignore` - Files to ignore from linting

**Custom Rules:**
```javascript
{
  "no-console": ["warn", { "allow": ["warn", "error"] }],
  "import/extensions": ["error", "ignorePackages", { "js": "always" }],
  "max-len": ["warn", { "code": 100 }],
  // ... and more
}
```

**Usage:**
```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint:fix

# Check both ESLint and Prettier
npm run lint:check
```

### Prettier Configuration
**File:** `.prettierrc`
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Code Quality Improvements Made:
1. ✅ Removed `await` inside loops - menggunakan `Promise.all()` untuk parallel execution
2. ✅ Fixed import order - external imports before local
3. ✅ Fixed unused variables
4. ✅ Applied consistent code formatting
5. ✅ Added blank lines between class members
6. ✅ Used template literals instead of string concatenation

---

## ♿ Accessibility Features

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

## � Changelog

### Version 2.0.0 (November 2025)

#### ✨ New Features
- **Search Feature** - Real-time search dengan keyboard shortcut (Ctrl+K / Cmd+K)
- **Accessibility (a11y)** - ARIA labels, keyboard navigation, screen reader support
- **ESLint Integration** - Airbnb JavaScript Style Guide untuk code quality
- **Deployment Configs** - Vercel dan Netlify configurations

#### 🔧 Improvements
- Refactored loops to use `Promise.all()` for better performance (no await in loop)
- Added comprehensive error handling with SweetAlert2
- Improved loading states with custom web component
- Enhanced code formatting with Prettier
- Added keyboard shortcuts for common actions (Delete, Archive)

#### 🐛 Bug Fixes
- Fixed CORS issues with API integration
- Fixed validation on empty notes
- Fixed loading indicator positioning
- Fixed responsive layout on mobile devices

#### 📚 Documentation
- Updated README.md with complete features documentation
- Added accessibility features documentation
- Added deployment troubleshooting guide
- Added code quality guidelines

#### 🎯 Code Quality
- ESLint: 0 errors, 0 warnings
- Build size: 109 KB (production)
- All 11 criteria met (5 mandatory + 6 optional)

### Version 1.0.0 (Initial Release)

#### Core Features
- Web Components (6 custom elements)
- RESTful API integration
- CRUD operations (Create, Read, Delete)
- Archive/Unarchive functionality
- Loading indicators
- Responsive design
- Webpack 5 bundler

---

## �📄 License

ISC

---

## 👨‍💻 Submission Info

**Course:** Belajar Front-End Web Lanjutan
**Platform:** Dicoding Academy
**Submission:** 2 (RESTful API + Webpack)

---



