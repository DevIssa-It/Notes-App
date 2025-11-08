/**
 * Global Keyboard Shortcuts Handler
 * Usage: Just import this file in app.js
 */

class KeyboardShortcuts {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('search-bar');
        if (searchInput) {
          const input = searchInput.shadowRoot.querySelector('.search-input');
          if (input) input.focus();
        }
      }

      // Ctrl/Cmd + N - Focus new note input
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const noteInput = document.querySelector('note-input');
        if (noteInput) {
          const titleInput = noteInput.shadowRoot.querySelector('input[name="title"]');
          if (titleInput) {
            titleInput.focus();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }

      // ESC - Close any open modal
      if (e.key === 'Escape') {
        const modal = document.querySelector('note-edit-modal[open]');
        if (modal) {
          modal.close();
        }
        
        // If in detail view, go back to list
        const detailContainer = document.getElementById('noteDetailContainer');
        if (detailContainer && detailContainer.style.display !== 'none') {
          const backButton = detailContainer.querySelector('note-detail');
          if (backButton) {
            backButton.dispatchEvent(new CustomEvent('back', {
              bubbles: true,
              composed: true,
            }));
          }
        }

        // Clear search
        const searchBar = document.querySelector('search-bar');
        if (searchBar && searchBar.value) {
          searchBar.value = '';
        }
      }

      // Ctrl/Cmd + / - Show keyboard shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        this.showShortcutsHelp();
      }
    });
  }

  showShortcutsHelp() {
    const shortcuts = [
      { keys: 'Ctrl/⌘ + K', action: 'Focus search' },
      { keys: 'Ctrl/⌘ + N', action: 'New note' },
      { keys: 'Ctrl/⌘ + /', action: 'Show shortcuts' },
      { keys: 'ESC', action: 'Close modal / Clear search / Back to list' },
    ];

    const shortcutsHTML = shortcuts.map(s => 
      `<div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2);">
        <kbd style="background: rgba(124, 58, 237, 0.1); padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 0.85rem;">${s.keys}</kbd>
        <span style="color: var(--text-secondary);">${s.action}</span>
      </div>`
    ).join('');

    // Use native alert for now (could be replaced with custom modal)
    const helpDiv = document.createElement('div');
    helpDiv.innerHTML = `
      <div style="font-family: Inter, sans-serif; color: var(--text-primary);">
        <h3 style="margin-top: 0; background: linear-gradient(135deg, #7c3aed, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ⌨️ Keyboard Shortcuts
        </h3>
        ${shortcutsHTML}
      </div>
    `;

    // Simple implementation - could be improved with custom modal
    if (window.Swal) {
      window.Swal.fire({
        html: helpDiv.innerHTML,
        showConfirmButton: true,
        confirmButtonText: 'Got it!',
        customClass: {
          popup: 'shortcuts-modal',
        },
      });
    }
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new KeyboardShortcuts());
} else {
  new KeyboardShortcuts();
}

export default KeyboardShortcuts;
