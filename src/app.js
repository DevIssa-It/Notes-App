// Import styles
import '../styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import components
import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/note-list.js';
import './components/loading-indicator.js';
import './components/search-bar.js';
import './components/note-detail.js';
import './components/note-edit-modal.js';
import './components/theme-toggle.js';
import './components/note-stats.js';
import './components/keyboard-shortcuts.js';
import './components/bulk-actions-bar.js';
import './components/toast-notification.js';
import './components/stats-badge.js';
import './components/shortcuts-modal.js';
import './components/note-skeleton.js';

// Import state management
import {
  loadNotesFromAPI,
  getActiveNotes,
  getArchivedNotes,
  getNoteById,
  getStats,
} from './state/notes-store.js';

// Import renderers
import {
  renderNotes,
  renderArchivedSection,
  updateArchivedCount,
  updateStats,
  setSearchQuery,
  setCurrentFilter,
  getCurrentFilter,
  setCurrentSort,
} from './renderers/notes-renderer.js';

// Import handlers
import {
  handleCreateNote,
  handleUpdateNote,
  handleDeleteNote,
  handleArchiveNote,
  handleUnarchiveNote,
  handlePinNote,
  handleUnpinNote,
  handleFavoriteNote,
  handleUnfavoriteNote,
} from './handlers/note-handlers.js';

import {
  handleRestoreAll,
  handleDeleteAll,
} from './handlers/bulk-handlers.js';

import {
  handleExportNotes as exportNotes,
} from './handlers/export-import-handlers.js';

// Import utilities
import { showError, showConfirm } from './ui-helpers.js';

/**
 * Show toast notification
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {number} duration - Auto-close duration in ms (0 = no auto-close)
 */
function showToast(type, title, message, duration = 3000) {
  const toast = document.querySelector('toast-notification');
  if (toast) {
    toast.show({ type, title, message, duration });
  }
}

/**
 * Refresh all views
 */
function refreshViews() {
  const notesGrid = document.getElementById('notesGrid');
  const archivedGrid = document.getElementById('archivedGrid');

  renderNotes(notesGrid, getActiveNotes());
  renderArchivedSection(archivedGrid, getArchivedNotes());
  
  const stats = getStats();
  updateArchivedCount(stats.archivedCount);
  updateStats(stats);
  
  // Update stats badge
  const statsBadge = document.querySelector('stats-badge');
  if (statsBadge) {
    statsBadge.updateStats(stats.activeCount, stats.archivedCount);
  }
}

/**
 * Show list view (hide detail view)
 */
function showListView() {
  const mainContainer = document.querySelector('main');
  const detailContainer = document.getElementById('noteDetailContainer');
  if (mainContainer) mainContainer.style.display = 'block';
  if (detailContainer) {
    detailContainer.style.display = 'none';
    detailContainer.innerHTML = '';
  }
}

/**
 * Show edit modal
 * @param {Object} note - Note to edit
 */
function showEditModal(note) {
  const modal = document.querySelector('note-edit-modal');
  if (modal) {
    modal.note = note;
    modal.open();
  }
}

/**
 * Show note detail view
 * @param {Object} note - Note to display
 */
function showNoteDetail(note) {
  const detailContainer = document.getElementById('noteDetailContainer');
  const mainContainer = document.querySelector('main');

  if (!detailContainer) return;

  mainContainer.style.display = 'none';
  detailContainer.style.display = 'block';
  detailContainer.innerHTML = '';

  const noteDetail = document.createElement('note-detail');
  noteDetail.note = note;
  
  // Attach event listeners to the newly created note-detail
  noteDetail.addEventListener('back', showListView);

  noteDetail.addEventListener('edit', (e) => {
    const noteToEdit = getNoteById(e.detail.noteId);
    if (noteToEdit) showEditModal(noteToEdit);
  });

  noteDetail.addEventListener('archive', async (e) => {
    await handleArchiveNote(e.detail.noteId, () => {
      showListView();
      refreshViews();
    });
  });

  noteDetail.addEventListener('unarchive', async (e) => {
    await handleUnarchiveNote(e.detail.noteId, () => {
      showListView();
      refreshViews();
    });
  });

  noteDetail.addEventListener('delete', async (e) => {
    const confirmed = await showConfirm(
      'Are you sure?',
      "You won't be able to revert this!",
      'Yes, delete it!'
    );

    if (confirmed) {
      await handleDeleteNote(e.detail.noteId, () => {
        showListView();
        refreshViews();
      });
    }
  });
  
  detailContainer.appendChild(noteDetail);
}

/**
 * Set active filter
 * @param {string} filter - Filter to activate
 */
function setFilter(filter) {
  setCurrentFilter(filter);
  const notesGrid = document.getElementById('notesGrid');
  renderNotes(notesGrid, getActiveNotes());

  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach((b) => {
    const isActive = b.dataset.filter === filter;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/**
 * Mount application and setup event listeners
 */
async function mount() {
  // Load data
  await loadNotesFromAPI();

  // Get DOM elements
  const editModal = document.querySelector('note-edit-modal');
  const restoreAllBtn = document.getElementById('restoreAllBtn');
  const deleteAllArchivedBtn = document.getElementById('deleteAllArchivedBtn');
  const sortSelect = document.getElementById('sortSelect');

  // Initial render
  refreshViews();

  // === EVENT LISTENERS ===

  // Sort functionality
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      setCurrentSort(e.target.value);
      refreshViews();
    });
  }

  // Search functionality
  document.body.addEventListener('search', (e) => {
    setSearchQuery(e.detail.query);
    refreshViews();
  });

  // Note creation
  document.body.addEventListener('note-added', async (e) => {
    await handleCreateNote(e.detail, () => {
      showToast('success', 'Note Created', 'Your note has been saved successfully', 3000);
      refreshViews();
    });
  });

  // Note editing
  if (editModal) {
    editModal.addEventListener('save', async (e) => {
      await handleUpdateNote(e.detail.id, e.detail, (updatedNote) => {
        showToast('success', 'Note Updated', 'Changes saved successfully', 3000);
        refreshViews();
        // Use the new note ID since we delete old and create new
        if (updatedNote && updatedNote.id) {
          const freshNote = getNoteById(updatedNote.id);
          if (freshNote) showNoteDetail(freshNote);
        }
      });
    });
  }

  // Note detail view events are now handled in showNoteDetail() function

  // Note item click (show detail)
  document.body.addEventListener('note-click', (e) => {
    const note = getNoteById(e.detail.id);
    if (note) showNoteDetail(note);
  });

  // Note item edit
  document.body.addEventListener('note-edit', (e) => {
    const note = getNoteById(e.detail.id);
    if (note) showEditModal(note);
  });

  // Note item archive/unarchive
  document.body.addEventListener('note-archive', async (e) => {
    await handleArchiveNote(e.detail.id, () => {
      showToast('success', 'Note Archived', 'Note moved to archive', 3000);
      refreshViews();
    });
  });

  document.body.addEventListener('note-unarchive', async (e) => {
    await handleUnarchiveNote(e.detail.id, () => {
      showToast('success', 'Note Restored', 'Note moved back to active notes', 3000);
      refreshViews();
    });
  });

  // Note item pin/unpin
  document.body.addEventListener('note-pin', (e) => {
    handlePinNote(e.detail.id, refreshViews);
  });

  document.body.addEventListener('note-unpin', (e) => {
    handleUnpinNote(e.detail.id, refreshViews);
  });

  // Note item favorite/unfavorite
  document.body.addEventListener('note-favorite', (e) => {
    handleFavoriteNote(e.detail.id, refreshViews);
  });

  document.body.addEventListener('note-unfavorite', (e) => {
    handleUnfavoriteNote(e.detail.id, refreshViews);
  });

  // Note item delete
  document.body.addEventListener('note-delete', async (e) => {
    const confirmed = await showConfirm(
      'Are you sure?',
      "You won't be able to revert this!",
      'Yes, delete it!'
    );

    if (confirmed) {
      await handleDeleteNote(e.detail.id, refreshViews);
    }
  });

  // === BULK SELECTION & ACTIONS ===
  const bulkBar = document.querySelector('bulk-actions-bar');
  const selectedNotes = new Set();

  // Handle note selection changes
  document.body.addEventListener('note-selection-changed', (e) => {
    if (e.detail.selected) {
      selectedNotes.add(e.detail.id);
    } else {
      selectedNotes.delete(e.detail.id);
    }
    
    if (bulkBar) {
      bulkBar.setSelectedIds(Array.from(selectedNotes));
    }
    
    // Enable selection mode on all note items
    if (selectedNotes.size > 0) {
      document.querySelectorAll('note-item').forEach(item => {
        item.setAttribute('selection-mode', '');
      });
    } else {
      document.querySelectorAll('note-item').forEach(item => {
        item.removeAttribute('selection-mode');
      });
    }
  });

  // Handle clear selection from bulk bar
  document.body.addEventListener('clear-selection', () => {
    selectedNotes.clear();
    document.querySelectorAll('note-item').forEach(item => {
      item.removeAttribute('selection-mode');
      const checkbox = item.shadowRoot.querySelector('.checkbox-input');
      if (checkbox) checkbox.checked = false;
      const card = item.shadowRoot.querySelector('.note-card');
      if (card) card.classList.remove('selected');
    });
  });

  // Handle bulk archive
  document.body.addEventListener('bulk-archive', async (e) => {
    const { ids } = e.detail;
    if (ids.length === 0) return;
    
    const confirmed = await showConfirm(
      'Archive Multiple Notes',
      `Archive ${ids.length} note(s)?`,
      'Yes, archive'
    );
    
    if (confirmed) {
      await Promise.all(ids.map(id => handleArchiveNote(id, () => {})));
      showToast('success', 'Bulk Archive Complete', `${ids.length} note(s) archived successfully`, 3000);
      selectedNotes.clear();
      if (bulkBar) bulkBar.clearSelection();
      refreshViews();
    }
  });

  // Handle bulk delete
  document.body.addEventListener('bulk-delete', async (e) => {
    const { ids } = e.detail;
    if (ids.length === 0) return;
    
    const confirmed = await showConfirm(
      'Delete Multiple Notes',
      `Permanently delete ${ids.length} note(s)? This cannot be undone!`,
      'Yes, delete all'
    );
    
    if (confirmed) {
      await Promise.all(ids.map(id => handleDeleteNote(id, () => {})));
      showToast('success', 'Bulk Delete Complete', `${ids.length} note(s) deleted successfully`, 3000);
      selectedNotes.clear();
      if (bulkBar) bulkBar.clearSelection();
      refreshViews();
    }
  });

  // Bulk actions
  if (restoreAllBtn) {
    restoreAllBtn.addEventListener('click', async () => {
      await handleRestoreAll(refreshViews);
    });
  }

  if (deleteAllArchivedBtn) {
    deleteAllArchivedBtn.addEventListener('click', async () => {
      await handleDeleteAll(refreshViews);
    });
  }

  // Export notes
  document.body.addEventListener('export-notes', exportNotes);

  // Import notes
  document.body.addEventListener('import-notes', async (e) => {
    if (e.detail && e.detail.data) {
      const importData = e.detail.data;
      
      // Validate and show confirmation
      const confirmed = await showConfirm(
        'Import Notes',
        `This will import ${importData.metadata?.totalNotes || 0} notes. Continue?`,
        'Yes, import'
      );
      
      if (confirmed) {
        try {
          // Import active notes
          const activePromises = importData.notes.active.map((note) =>
            handleCreateNote({ title: note.title, body: note.body }, () => {})
          );
          
          await Promise.all(activePromises);
          
          // Import archived notes
          const archivedResults = await Promise.all(
            importData.notes.archived.map((note) =>
              handleCreateNote({ title: note.title, body: note.body }, () => {})
            )
          );
          
          // Archive imported notes
          const archivePromises = archivedResults
            .filter((created) => created && created.id)
            .map((created) => handleArchiveNote(created.id, () => {}));
          
          await Promise.all(archivePromises);
          
          // Refresh views after import
          await loadNotesFromAPI();
          refreshViews();
        } catch (error) {
          showError('Import failed', error);
        }
      }
    }
  });

  document.body.addEventListener('import-error', (e) => {
    showError('Import error', new Error(e.detail && e.detail.error));
  });

  // Filter buttons
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.filter-btn');
    if (btn) {
      setFilter(btn.dataset.filter);
    }
  });

  // Initialize filter buttons state
  document.querySelectorAll('.filter-btn').forEach((b) => {
    const isActive = b.dataset.filter === getCurrentFilter();
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Warn before leaving with unsaved changes
  window.addEventListener('beforeunload', (e) => {
    const input = document.querySelector('note-input');
    if (input && input.hasUnsavedChanges && input.hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl+K - Show shortcuts modal
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const modal = document.querySelector('shortcuts-modal');
      if (modal) modal.open();
    }

    // Ctrl+F - Focus search
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      const searchBar = document.querySelector('search-bar');
      if (searchBar) {
        const input = searchBar.shadowRoot.querySelector('.search-input');
        if (input) input.focus();
      }
    }

    // Ctrl+N - Focus new note input
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      const noteInput = document.querySelector('note-input');
      if (noteInput) {
        const titleInput = noteInput.shadowRoot.querySelector('#noteTitle');
        if (titleInput) titleInput.focus();
      }
    }

    // Ctrl+T - Toggle theme
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      const themeToggle = document.querySelector('theme-toggle');
      if (themeToggle) {
        const btn = themeToggle.shadowRoot.querySelector('.theme-toggle');
        if (btn) btn.click();
      }
    }
  });
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
