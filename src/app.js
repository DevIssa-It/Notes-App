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
} from './renderers/notes-renderer.js';

// Import handlers
import {
  handleCreateNote,
  handleUpdateNote,
  handleDeleteNote,
  handleArchiveNote,
  handleUnarchiveNote,
} from './handlers/note-handlers.js';

import {
  handleRestoreAll,
  handleDeleteAll,
  handleExportNotes,
} from './handlers/bulk-handlers.js';

// Import utilities
import { MESSAGES } from './constants.js';
import { showError, showConfirm } from './ui-helpers.js';

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
  detailContainer.appendChild(noteDetail);
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
  const noteInput = document.querySelector('note-input');
  const noteDetail = document.querySelector('note-detail');
  const editModal = document.querySelector('note-edit-modal');
  const restoreAllBtn = document.getElementById('restoreAllBtn');
  const deleteAllArchivedBtn = document.getElementById('deleteAllArchivedBtn');

  // Initial render
  refreshViews();

  // === EVENT LISTENERS ===

  // Search functionality
  document.body.addEventListener('search', (e) => {
    setSearchQuery(e.detail.query);
    refreshViews();
  });

  // Note creation
  if (noteInput) {
    noteInput.addEventListener('note-add', async (e) => {
      await handleCreateNote(e.detail, refreshViews);
    });
  }

  // Note editing
  if (editModal) {
    editModal.addEventListener('save', async (e) => {
      await handleUpdateNote(e.detail.id, e.detail, () => {
        refreshViews();
        const updatedNote = getNoteById(e.detail.id);
        if (updatedNote) showNoteDetail(updatedNote);
      });
    });
  }

  // Note detail view events
  if (noteDetail) {
    noteDetail.addEventListener('back', showListView);

    noteDetail.addEventListener('edit', (e) => {
      const note = getNoteById(e.detail.noteId);
      if (note) showEditModal(note);
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
  }

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
    await handleArchiveNote(e.detail.id, refreshViews);
  });

  document.body.addEventListener('note-unarchive', async (e) => {
    await handleUnarchiveNote(e.detail.id, refreshViews);
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
  document.body.addEventListener('export-notes', handleExportNotes);

  // Import notes (not available in API mode)
  document.body.addEventListener('import-notes', () => {
    showError(MESSAGES.ERROR.IMPORT_NOT_AVAILABLE);
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
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
