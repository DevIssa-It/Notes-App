# 🔧 Panduan Refactoring - Mengurangi Panjang File Komponen

## 📋 Ringkasan

Proyek ini memiliki beberapa file komponen yang sangat panjang (500-1000+ baris) karena CSS inline di dalam template. Dokumen ini memberikan panduan lengkap untuk me-refactor kode menjadi lebih modular dan maintainable.

## 🎯 Tujuan
- ✅ Mengurangi panjang file dari 1000+ baris menjadi < 300 baris
- ✅ Memisahkan concerns (CSS terpisah dari JavaScript)
- ✅ Meningkatkan code reusability
- ✅ Mempermudah maintenance dan debugging
- ✅ Membuat 10 commits untuk tracking yang baik

## 📊 Analisis File yang Perlu Di-refactor

| File | Baris | Priority | CSS Lines (~) |
|------|-------|----------|---------------|
| `note-item.js` | 1096 | 🔴 Urgent | ~640 |
| `note-edit-modal.js` | 388 | 🟠 High | ~250 |
| `note-detail.js` | 370 | 🟠 High | ~240 |
| `shortcuts-modal.js` | 267 | 🟡 Medium | ~180 |
| `search-bar.js` | 215 | 🟡 Medium | ~140 |
| `bulk-actions-bar.js` | 201 | 🟡 Medium | ~130 |
| `toast-notification.js` | 198 | 🟡 Medium | ~125 |
| `app-bar.js` | 182 | 🟢 Low | ~110 |
| `note-input.js` | 183 | ✅ Done | ✅ |

## 🛠️ Rencana 10 Commits

### ✅ Commit 1 & 2 (DONE)
```bash
# Commit 1: Create styles folder structure
git commit -m "refactor: create separate CSS files structure for components"

# Commit 2: Refactor note-input.js  
git commit -m "refactor: extract note-input styles to separate file"
```

### Commit 3: Refactor note-item.js (1096 lines → ~450 lines)

**File yang akan dibuat:** `src/components/styles/note-item-styles.js`

**Langkah:**
1. Buat file `src/components/styles/note-item-styles.js`:
```javascript
export const noteItemStyles = `
  :host {
    display: block;
    width: 100%;
    transition: all 300ms ease;
  }
  
  /* Sisanya ~640 baris CSS dari note-item.js */
  /* Copy dari baris 7-645 di note-item.js */
`;
```

2. Edit `src/components/note-item.js`:
```javascript
import { formatRelativeTime } from '../utils.js';
import { sharedCss, sharedSheet } from './shared-styles.js';
import { noteItemStyles } from './styles/note-item-styles.js';  // ← Tambahkan

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${noteItemStyles}  // ← Ganti semua CSS dengan ini
  </style>
  <article class="note-card">
    <!-- HTML tetap sama -->
```

3. Commit:
```bash
git add src/components/note-item.js src/components/styles/note-item-styles.js
git commit -m "refactor: extract note-item styles to separate file (reduce from 1096 to ~450 lines)"
```

### Commit 4: Refactor note-edit-modal.js & note-detail.js

**File yang akan dibuat:**
- `src/components/styles/note-edit-modal-styles.js`
- `src/components/styles/note-detail-styles.js`

**Langkah yang sama** seperti Commit 3, lakukan untuk kedua file:
```bash
git add src/components/note-edit-modal.js src/components/note-detail.js src/components/styles/note-*-styles.js
git commit -m "refactor: extract note-edit-modal & note-detail styles"
```

### Commit 5: Refactor shortcuts-modal.js & search-bar.js

**File:**
- `src/components/styles/shortcuts-modal-styles.js`
- `src/components/styles/search-bar-styles.js`

```bash
git add src/components/shortcuts-modal.js src/components/search-bar.js src/components/styles/*
git commit -m "refactor: extract shortcuts-modal & search-bar styles"
```

### Commit 6: Refactor bulk-actions-bar.js & toast-notification.js

```bash
git add src/components/bulk-actions-bar.js src/components/toast-notification.js src/components/styles/*
git commit -m "refactor: extract bulk-actions-bar & toast-notification styles"
```

### Commit 7: Refactor app-bar.js & note-skeleton.js

```bash
git add src/components/app-bar.js src/components/note-skeleton.js src/components/styles/*
git commit -m "refactor: extract app-bar & note-skeleton styles"
```

### Commit 8: Refactor theme-toggle.js & loading-indicator.js

```bash
git add src/components/theme-toggle.js src/components/loading-indicator.js src/components/styles/*
git commit -m "refactor: extract theme-toggle & loading-indicator styles"
```

### Commit 9: Refactor remaining small components

**Components:**
- keyboard-shortcuts.js
- stats-badge.js  
- note-stats.js
- note-list.js (jika perlu)

```bash
git add src/components/*.js src/components/styles/*
git commit -m "refactor: extract remaining component styles"
```

### Commit 10: Documentation & Style Guide

**File yang akan dibuat:**
- Update `README.md` dengan struktur baru
- Buat `STYLE_GUIDE.md`
- Buat `src/components/styles/README.md`

```bash
git add README.md STYLE_GUIDE.md src/components/styles/README.md
git commit -m "docs: add style guide and update documentation"
```

## 📝 Template untuk Ekstraksi CSS

### 1. Buat File Style Baru

**Template:** `src/components/styles/[component-name]-styles.js`

```javascript
// Exported component styles for [ComponentName]
export const [componentName]Styles = `
  /* Paste CSS here from line X to Y of original file */
  :host {
    /* ... */
  }
  
  /* Component-specific styles */
  .class-name {
    /* ... */
  }
`;
```

### 2. Update File Komponen

**Before:**
```javascript
const template = document.createElement('template');
template.innerHTML = `
  <style>
    /* 500+ lines of CSS */
  </style>
  <div>HTML</div>
`;
```

**After:**
```javascript
import { componentStyles } from './styles/component-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${componentStyles}
  </style>
  <div>HTML</div>
`;
```

## 🚀 Quick Start - Lakukan Sekarang!

### Opsi A: Refactor Satu Per Satu (Recommended)

```bash
# 1. Pilih file terbesar (note-item.js)
code src/components/note-item.js

# 2. Cari baris CSS (biasanya line 7 sampai tag </style>)
# 3. Copy CSS ke file baru
# 4. Import dan ganti

# 5. Commit
git add src/components/note-item.js src/components/styles/note-item-styles.js
git commit -m "refactor: extract note-item styles"
```

### Opsi B: Batch Refactoring

Gunakan script PowerShell untuk extract CSS otomatis:

```powershell
# Script extract-css.ps1
$componentFiles = Get-ChildItem "src/components/*.js" -Exclude "shared-styles.js"

foreach ($file in $componentFiles) {
    # Extract CSS between <style> tags
    # Create new style file
    # Update component file
    # Commit changes
}
```

## ✅ Checklist Refactoring

- [ ] Commit 1: ✅ Create styles folder
- [ ] Commit 2: ✅ Refactor note-input.js
- [ ] Commit 3: Refactor note-item.js (1096 lines)
- [ ] Commit 4: Refactor note-edit-modal & note-detail
- [ ] Commit 5: Refactor shortcuts-modal & search-bar
- [ ] Commit 6: Refactor bulk-actions-bar & toast-notification
- [ ] Commit 7: Refactor app-bar & note-skeleton
- [ ] Commit 8: Refactor theme-toggle & loading-indicator
- [ ] Commit 9: Refactor remaining components
- [ ] Commit 10: Update documentation

## 📚 Manfaat Setelah Refactoring

### Before:
```
src/components/
  note-item.js (1096 lines) 😱
  note-edit-modal.js (388 lines)
  ...
```

### After:
```
src/components/
  note-item.js (~450 lines) ✅
  note-edit-modal.js (~140 lines) ✅
  styles/
    note-item-styles.js (~640 lines CSS)
    note-edit-modal-styles.js (~250 lines CSS)
    ...
```

### Keuntungan:
- ✅ **Readability**: Lebih mudah dibaca & dipahami
- ✅ **Maintainability**: CSS terpisah, lebih mudah di-maintain
- ✅ **Reusability**: CSS bisa di-reuse atau di-share
- ✅ **Performance**: Tidak ada impact, hanya reorganisasi
- ✅ **Git History**: 10 commits yang clear & traceable

## 🎓 Best Practices

1. **Naming Convention:**
   - File JS: `component-name.js`
   - File CSS: `component-name-styles.js`
   - Export: `componentNameStyles`

2. **Import Order:**
   ```javascript
   // 1. External utilities
   import { formatRelativeTime } from '../utils.js';
   
   // 2. Shared styles
   import { sharedCss, sharedSheet } from './shared-styles.js';
   
   // 3. Component styles
   import { componentStyles } from './styles/component-styles.js';
   ```

3. **Commit Messages:**
   - Use conventional commits: `refactor:`, `feat:`, `docs:`
   - Be specific: include file names & line count changes
   - Example: `refactor: extract note-item styles (reduce from 1096 to 450 lines)`

## 🔗 Resources

- [Web Components Best Practices](https://developers.google.com/web/fundamentals/web-components/best-practices)
- [CSS Modules for Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Created:** November 11, 2025  
**Target:** 10 commits hari ini  
**Status:** 2/10 commits completed ✅

**Next Steps:** Mulai dari Commit 3 (note-item.js) - file terbesar!
