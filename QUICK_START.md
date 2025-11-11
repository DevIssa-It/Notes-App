# 🚀 Quick Refactoring Cheat Sheet

## TL;DR - Lakukan Ini Untuk Setiap File:

### Method 1: Manual (Simple & Clear)

```bash
# 1. Buka file komponen
code src/components/note-item.js

# 2. Select semua CSS (dari baris ~7 sampai </style>)
# 3. Cut (Ctrl+X)

# 4. Buat file baru: src/components/styles/note-item-styles.js
# 5. Paste CSS dengan template:
```

```javascript
export const noteItemStyles = `
  [PASTE CSS DI SINI]
`;
```

```bash
# 6. Di file note-item.js, tambahkan import:
import { noteItemStyles } from './styles/note-item-styles.js';

# 7. Ganti <style>...</style> dengan:
<style>
  ${noteItemStyles}
</style>

# 8. Commit:
git add src/components/note-item.js src/components/styles/note-item-styles.js
git commit -m "refactor: extract note-item styles"
```

---

## Method 2: Using PowerShell Script (Faster)

```powershell
# Jalankan script untuk setiap komponen:
.\extract-css.ps1 note-item
.\extract-css.ps1 note-edit-modal
.\extract-css.ps1 search-bar
# dst...
```

---

## 📋 Task List - Copy & Check Off

```markdown
- [x] Commit 1: Create styles folder ✅
- [x] Commit 2: note-input.js ✅  
- [x] Commit 3: Documentation ✅
- [ ] Commit 4: note-item.js (PRIORITY! 1096 lines)
- [ ] Commit 5: note-edit-modal.js (388 lines)
- [ ] Commit 6: note-detail.js (370 lines)
- [ ] Commit 7: shortcuts-modal.js + search-bar.js
- [ ] Commit 8: bulk-actions-bar.js + toast-notification.js
- [ ] Commit 9: app-bar.js + note-skeleton.js
- [ ] Commit 10: theme-toggle.js + loading-indicator.js

🎯 Target: 10 commits hari ini!
```

---

## ⚡ Super Quick Commands

### Untuk note-item.js (File Terbesar!)

```bash
# 1. Buat file style
New-Item -Path "src/components/styles/note-item-styles.js" -ItemType File

# 2. Edit file, copy CSS (line 7-645)
code src/components/note-item.js

# 3. Format file style dengan template
code src/components/styles/note-item-styles.js

# 4. Update import di note-item.js
# 5. Commit
git add src/components/note-item.js src/components/styles/note-item-styles.js
git commit -m "refactor: extract note-item styles (reduce 1096→450 lines)"
```

---

## 🎨 Template Copy-Paste

### Template untuk File Style Baru:

```javascript
// src/components/styles/COMPONENT-NAME-styles.js
export const componentNameStyles = `
  PASTE_CSS_HERE
`;
```

### Template untuk Update Komponen:

```javascript
// Di bagian atas file, tambahkan:
import { componentNameStyles } from './styles/COMPONENT-NAME-styles.js';

// Di template.innerHTML, ganti:
template.innerHTML = `
  <style>
    ${componentNameStyles}  // ← Ganti CSS dengan variable ini
  </style>
  <div>HTML tetap sama...</div>
`;
```

---

## 🔍 Cara Cari CSS di File:

1. Buka file komponen
2. Cari baris: `template.innerHTML = \``
3. Cari tag `<style>`
4. Select sampai `</style>`
5. Itu CSS yang perlu di-extract!

---

## ✅ Verification Checklist

Setelah refactor setiap file:

- [ ] Import statement ditambahkan di atas
- [ ] CSS dipindah ke file terpisah dengan export
- [ ] Template menggunakan `${variableStyles}`
- [ ] File masih bisa di-run tanpa error
- [ ] Commit dengan pesan yang jelas

---

## 🎯 TODAY'S GOAL

```
Sekarang: 3/10 commits ✅
Target: 10/10 commits today! 🚀

Fokus: 
1. note-item.js (Terbesar!)
2. note-edit-modal.js
3. note-detail.js
4. Sisanya pair up components

Estimated time: 
- Per file: 5-10 menit
- Total: 1-2 jam
```

---

**READY? START WITH note-item.js NOW! 💪**

```bash
code src/components/note-item.js
# Find line 7, select until line 645 (the </style> tag)
# Cut, create new file, paste, update import, commit!
```
