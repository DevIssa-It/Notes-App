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
import Swal from 'sweetalert2';
import NotesAPI from './api.js';

const notesStore = new Map();
const archivedStore = new Map();
let currentFilter = 'all'; // 'all' or 'archived'
let currentSearchQuery = ''; // current search query
let loadingIndicator = null;

// Helper function to show loading
function showLoading(message = 'Loading...', submessage = 'Please wait') {
  if (!loadingIndicator) {
    loadingIndicator = document.querySelector('loading-indicator');
  }
  if (loadingIndicator) {
    loadingIndicator.show(message, submessage);
  }
}

// Helper function to hide loading
function hideLoading() {
  if (loadingIndicator) {
    loadingIndicator.hide();
  }
}

// Helper to get current theme colors for SweetAlert
function getSwalTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  return {
    background: isLight ? '#ffffff' : '#1e293b',
    color: isLight ? '#0f172a' : '#e6eef8',
  };
}

// Helper function to show error
function showError(message, error) {
  console.error(message, error);
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    footer: error ? `<small>${error.message}</small>` : '',
    confirmButtonColor: '#7c3aed',
    background: theme.background,
    color: theme.color,
  });
}

// Helper function to show success
function showSuccess(message) {
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 2000,
    showConfirmButton: false,
    background: theme.background,
    color: theme.color,
  });
}

// Helper function to show success with undo action
function showSuccessWithUndo(message, undoCallback) {
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 5000,
    showConfirmButton: true,
    confirmButtonText: '<i class="fas fa-undo"></i> Undo',
    confirmButtonColor: '#7c3aed',
    background: theme.background,
    color: theme.color,
  }).then((result) => {
    if (result.isConfirmed && undoCallback) {
      undoCallback();
    }
  });
}

// Load notes from API
async function loadNotesFromAPI() {
  try {
    showLoading('Loading notes...', 'Fetching from server');
    const notes = await NotesAPI.getNotes();
    const archivedNotes = await NotesAPI.getArchivedNotes();

    notesStore.clear();
    archivedStore.clear();

    notes.forEach((n) => notesStore.set(n.id, { ...n, archived: false }));
    archivedNotes.forEach((n) =>
      archivedStore.set(n.id, { ...n, archived: true })
    );

    return true;
  } catch (error) {
    showError('Failed to load notes from server', error);
    return false;
  } finally {
    hideLoading();
  }
}

function renderNotes(container) {
  container.innerHTML = ''; // clear
  let arr = Array.from(notesStore.values());

  // Filter by search query
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    arr = arr.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  // sort by createdAt desc
  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  arr.forEach((n) => {
    const item = document.createElement('note-item');
    item.data = n; // sets attributes
    item.setAttribute('data-id', n.id);
    item.setAttribute('tabindex', '0'); // Make focusable

    container.appendChild(item);
  });

  // Update search result count
  const searchBar = document.querySelector('search-bar');
  if (searchBar && currentSearchQuery) {
    searchBar.updateResult(arr.length, notesStore.size);
  }

  // Show message if no notes
  if (arr.length === 0) {
    if (currentSearchQuery) {
      container.innerHTML = `<p class="empty-message">No notes found for "${currentSearchQuery}"</p>`;
    } else {
      container.innerHTML =
        '<p class="empty-message">No notes yet. Create your first note!</p>';
    }
  }
}

function renderArchivedSection(container) {
  container.innerHTML = '';
  let arr = Array.from(archivedStore.values());

  // Filter by search query
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    arr = arr.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  arr.forEach((n) => {
    const item = document.createElement('note-item');
    item.data = n;
    item.setAttribute('data-id', n.id);
    item.setAttribute('archived', 'true');
    item.setAttribute('tabindex', '0'); // Make focusable
    container.appendChild(item);
  });

  // Show message if no archived notes
  if (arr.length === 0) {
    if (currentSearchQuery) {
      container.innerHTML = `<p class="empty-message">No archived notes found for "${currentSearchQuery}"</p>`;
    } else {
      container.innerHTML =
        '<p class="empty-message">No archived notes. Archive notes to see them here.</p>';
    }
  }
}

// Update archived count (legacy)
function updateArchivedCount() {
  const cnt = archivedStore.size;
  const span = document.getElementById('archivedCount');
  if (span) span.textContent = String(cnt);
}

// Update stats display
function updateStats() {
  const statsEl = document.querySelector('note-stats');
  if (statsEl) {
    statsEl.activeCount = notesStore.size;
    statsEl.archivedCount = archivedStore.size;
    statsEl.totalCount = notesStore.size + archivedStore.size;
  }
  updateArchivedCount();
}

// Show list view
function showListView() {
  const mainContainer = document.querySelector('main');
  const detailContainer = document.getElementById('noteDetailContainer');

  if (mainContainer) {
    mainContainer.style.display = 'block';
  }

  if (detailContainer) {
    detailContainer.style.display = 'none';
    detailContainer.innerHTML = '';
  }
}

// Show edit modal
function showEditModal(note) {
  let editModal = document.querySelector('note-edit-modal');
  
  if (!editModal) {
    editModal = document.createElement('note-edit-modal');
    document.body.appendChild(editModal);
  }

  editModal.note = note;
  editModal.open();
}

// Show detail view
function showNoteDetail(note) {
  const mainContainer = document.querySelector('main');
  if (!mainContainer) return;

  // Hide list view
  mainContainer.style.display = 'none';

  // Create or get detail view container
  let detailContainer = document.getElementById('noteDetailContainer');
  if (!detailContainer) {
    detailContainer = document.createElement('div');
    detailContainer.id = 'noteDetailContainer';
    document.body.appendChild(detailContainer);
  }

  detailContainer.style.display = 'block';
  detailContainer.innerHTML = '';

  const noteDetail = document.createElement('note-detail');
  noteDetail.note = note;
  detailContainer.appendChild(noteDetail);

  // Listen to back button
  noteDetail.addEventListener('back', () => {
    showListView();
  });

  // Listen to edit button
  noteDetail.addEventListener('edit', (e) => {
    const { note: noteToEdit } = e.detail;
    showEditModal(noteToEdit);
  });

  // Listen to archive button
  noteDetail.addEventListener('archive', async (e) => {
    const { noteId } = e.detail;
    try {
      showLoading('Archiving note...', 'Please wait');
      await NotesAPI.archiveNote(noteId);
      const noteData = notesStore.get(noteId);
      notesStore.delete(noteId);
      archivedStore.set(noteId, { ...noteData, archived: true });
      showSuccess('Note archived!');
      showListView();
      const notesGrid = document.getElementById('notesGrid');
      const archivedGrid = document.getElementById('archivedGrid');
      renderNotes(notesGrid);
      renderArchivedSection(archivedGrid);
      updateStats();
    } catch (error) {
      showError('Failed to archive note', error);
    } finally {
      hideLoading();
    }
  });

  // Listen to unarchive button
  noteDetail.addEventListener('unarchive', async (e) => {
    const { noteId } = e.detail;
    try {
      showLoading('Unarchiving note...', 'Please wait');
      await NotesAPI.unarchiveNote(noteId);
      const noteData = archivedStore.get(noteId);
      archivedStore.delete(noteId);
      notesStore.set(noteId, { ...noteData, archived: false });
      showSuccess('Note unarchived!');
      showListView();
      const notesGrid = document.getElementById('notesGrid');
      const archivedGrid = document.getElementById('archivedGrid');
      renderNotes(notesGrid);
      renderArchivedSection(archivedGrid);
      updateStats();
    } catch (error) {
      showError('Failed to unarchive note', error);
    } finally {
      hideLoading();
    }
  });

  // Listen to delete button
  noteDetail.addEventListener('delete', async (e) => {
    const { noteId } = e.detail;

    // Confirm before deleting
    const theme = getSwalTheme();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: theme.background,
      color: theme.color,
    });

    if (result.isConfirmed) {
      // Store deleted note for undo
      const deletedNote = notesStore.get(noteId) || archivedStore.get(noteId);
      const wasArchived = deletedNote?.archived || false;

      try {
        showLoading('Deleting note...', 'Please wait');
        await NotesAPI.deleteNote(noteId);
        notesStore.delete(noteId);
        archivedStore.delete(noteId);
        hideLoading();

        // Show success with undo option
        showSuccessWithUndo('Note deleted!', async () => {
          try {
            showLoading('Restoring note...', 'Please wait');
            const restored = await NotesAPI.createNote(
              deletedNote.title,
              deletedNote.body
            );
            if (wasArchived) {
              await NotesAPI.archiveNote(restored.id);
              archivedStore.set(restored.id, { ...restored, archived: true });
            } else {
              notesStore.set(restored.id, { ...restored, archived: false });
            }
            showSuccess('Note restored!');
            const notesGrid = document.getElementById('notesGrid');
            const archivedGrid = document.getElementById('archivedGrid');
            renderNotes(notesGrid);
            renderArchivedSection(archivedGrid);
            updateStats();
          } catch (error) {
            showError('Failed to restore note', error);
          } finally {
            hideLoading();
          }
        });

        showListView();
        const notesGrid = document.getElementById('notesGrid');
        const archivedGrid = document.getElementById('archivedGrid');
        renderNotes(notesGrid);
        renderArchivedSection(archivedGrid);
        updateStats();
      } catch (error) {
        showError('Failed to delete note', error);
        hideLoading();
      }
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

function setFilter(filter) {
  currentFilter = filter === 'archived' ? 'archived' : 'all';
  const notesGrid = document.getElementById('notesGrid');
  const archivedGrid = document.getElementById('archivedGrid');
  renderNotes(notesGrid);
  renderArchivedSection(archivedGrid);
  updateStats();
  // update active class on buttons and aria-pressed
  document.querySelectorAll('.filter-btn').forEach((b) => {
    const isActive = b.dataset.filter === currentFilter;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

async function mount() {
  // Load notes from API
  await loadNotesFromAPI();

  const notesGrid = document.getElementById('notesGrid');
  const archivedGrid = document.getElementById('archivedGrid');
  const restoreAllBtn = document.getElementById('restoreAllBtn');
  const deleteAllArchivedBtn = document.getElementById('deleteAllArchivedBtn');

  renderNotes(notesGrid);
  renderArchivedSection(archivedGrid);
  updateStats();

  // Listen to note click (view detail)
  document.body.addEventListener('note-click', (e) => {
    const { note } = e.detail;
    showNoteDetail(note);
  });

  // Listen to search
  document.body.addEventListener('search', (e) => {
    currentSearchQuery = e.detail.query;
    renderNotes(notesGrid);
    renderArchivedSection(archivedGrid);
  });

  // Listen to add
  document.body.addEventListener('note-added', async (e) => {
    const note = e.detail;
    try {
      showLoading('Creating note...', 'Saving to server');
      const createdNote = await NotesAPI.createNote({
        title: note.title,
        body: note.body,
      });
      notesStore.set(createdNote.id, { ...createdNote, archived: false });
      renderNotes(notesGrid);
      showSuccess('Note created successfully!');
    } catch (error) {
      showError('Failed to create note', error);
    } finally {
      hideLoading();
    }
  });

  // Listen to edit (update note)
  document.body.addEventListener('note-updated', async (e) => {
    const { id, title, body, archived } = e.detail;
    try {
      showLoading('Updating note...', 'Saving changes');
      
      // API Dicoding doesn't have UPDATE endpoint, so we delete and recreate
      await NotesAPI.deleteNote(id);
      const newNote = await NotesAPI.createNote({ title, body });
      
      // If it was archived, archive the new note
      if (archived) {
        await NotesAPI.archiveNote(newNote.id);
        archivedStore.delete(id);
        archivedStore.set(newNote.id, { ...newNote, archived: true });
      } else {
        notesStore.delete(id);
        notesStore.set(newNote.id, { ...newNote, archived: false });
      }
      
      renderNotes(notesGrid);
      renderArchivedSection(archivedGrid);
      showSuccess('Note updated successfully!');
      
      // Refresh detail view if open
      const detailContainer = document.getElementById('noteDetailContainer');
      if (detailContainer && detailContainer.style.display !== 'none') {
        const updatedNote = archived 
          ? archivedStore.get(newNote.id) 
          : notesStore.get(newNote.id);
        showNoteDetail(updatedNote);
      }
    } catch (error) {
      showError('Failed to update note', error);
    } finally {
      hideLoading();
    }
  });

  // listen to archive / delete from note-item bubbles
  document.body.addEventListener('note-archive', async (e) => {
    const { id } = e.detail;
    const isInNotes = notesStore.has(id);
    const isInArchived = archivedStore.has(id);

    try {
      showLoading('Processing...', 'Please wait');

      if (isInNotes) {
        // Archive the note
        await NotesAPI.archiveNote(id);
        const note = notesStore.get(id);
        notesStore.delete(id);
        archivedStore.set(id, { ...note, archived: true });
        showSuccess('Note archived!');
      } else if (isInArchived) {
        // Unarchive the note
        await NotesAPI.unarchiveNote(id);
        const note = archivedStore.get(id);
        archivedStore.delete(id);
        notesStore.set(id, { ...note, archived: false });
        showSuccess('Note unarchived!');
      }

      renderNotes(notesGrid);
      renderArchivedSection(archivedGrid);
      updateStats();
    } catch (error) {
      showError('Failed to process note', error);
    } finally {
      hideLoading();
    }
  });

  document.body.addEventListener('note-delete', async (e) => {
    const { id } = e.detail;

    // Confirm before deleting
    const theme = getSwalTheme();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: theme.background,
      color: theme.color,
    });

    if (result.isConfirmed) {
      try {
        showLoading('Deleting note...', 'Please wait');
        await NotesAPI.deleteNote(id);
        notesStore.delete(id);
        archivedStore.delete(id);
        renderNotes(notesGrid);
        renderArchivedSection(archivedGrid);
        updateStats();
        showSuccess('Note deleted!');
      } catch (error) {
        showError('Failed to delete note', error);
      } finally {
        hideLoading();
      }
    }
  });

  // bulk actions for archived section
  if (restoreAllBtn) {
    restoreAllBtn.addEventListener('click', async () => {
      const archivedIds = Array.from(archivedStore.keys());
      if (archivedIds.length === 0) {
        const theme = getSwalTheme();
        Swal.fire({
          icon: 'info',
          title: 'No archived notes',
          text: 'There are no archived notes to restore',
          background: theme.background,
          color: theme.color,
        });
        return;
      }

      try {
        showLoading(
          'Restoring all notes...',
          `Processing ${archivedIds.length} notes`
        );
        // Unarchive all notes - Use Promise.all for parallel execution
        await Promise.all(
          archivedIds.map(async (id) => {
            await NotesAPI.unarchiveNote(id);
            const note = archivedStore.get(id);
            archivedStore.delete(id);
            notesStore.set(id, { ...note, archived: false });
          })
        );
        renderNotes(notesGrid);
        renderArchivedSection(archivedGrid);
        updateStats();
        showSuccess('All notes restored!');
      } catch (error) {
        showError('Failed to restore all notes', error);
      } finally {
        hideLoading();
      }
    });
  }

  if (deleteAllArchivedBtn) {
    deleteAllArchivedBtn.addEventListener('click', async () => {
      const archivedIds = Array.from(archivedStore.keys());
      if (archivedIds.length === 0) {
        const theme = getSwalTheme();
        Swal.fire({
          icon: 'info',
          title: 'No archived notes',
          text: 'There are no archived notes to delete',
          background: theme.background,
          color: theme.color,
        });
        return;
      }

      const theme = getSwalTheme();
      const result = await Swal.fire({
        title: 'Delete all archived notes?',
        text: `This will permanently delete ${archivedIds.length} archived notes!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete all!',
        background: theme.background,
        color: theme.color,
      });

      if (result.isConfirmed) {
        try {
          showLoading(
            'Deleting all archived notes...',
            `Processing ${archivedIds.length} notes`
          );
          // Delete all archived notes - Use Promise.all for parallel execution
          await Promise.all(
            archivedIds.map(async (id) => {
              await NotesAPI.deleteNote(id);
              archivedStore.delete(id);
            })
          );
          renderNotes(notesGrid);
          renderArchivedSection(archivedGrid);
          updateStats();
          showSuccess('All archived notes deleted!');
        } catch (error) {
          showError('Failed to delete all archived notes', error);
        } finally {
          hideLoading();
        }
      }
    });
  }

  // export / import handlers (app-bar) - Not using API, just for local backup
  document.body.addEventListener('export-notes', async () => {
    try {
      showLoading('Exporting notes...', 'Preparing download');
      const allNotes = [
        ...Array.from(notesStore.values()),
        ...Array.from(archivedStore.values()),
      ];
      const data = JSON.stringify(allNotes, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-export-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      hideLoading();
      showSuccess('Notes exported successfully!');
    } catch (err) {
      hideLoading();
      showError('Export failed', err);
    }
  });

  document.body.addEventListener('import-notes', () => {
    const theme = getSwalTheme();
    Swal.fire({
      icon: 'info',
      title: 'Import Not Available',
      text: 'Import feature is disabled when using API mode. Please use the API to manage your notes.',
      background: theme.background,
      color: theme.color,
    });
  });

  document.body.addEventListener('import-error', (e) => {
    showError('Import error', new Error(e.detail && e.detail.error));
  });

  // filter buttons
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.filter-btn');
    if (btn) {
      setFilter(btn.dataset.filter);
    }
  });

  // initialize filter buttons state
  document.querySelectorAll('.filter-btn').forEach((b) => {
    const isActive = b.dataset.filter === currentFilter;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Warn before leaving if note input has unsaved changes
  window.addEventListener('beforeunload', (e) => {
    const noteInput = document.querySelector('note-input');
    if (noteInput) {
      const titleInput = noteInput.shadowRoot.querySelector('#noteTitle');
      const bodyInput = noteInput.shadowRoot.querySelector('#noteBody');
      const hasContent =
        (titleInput && titleInput.value.trim()) ||
        (bodyInput && bodyInput.value.trim());

      if (hasContent) {
        e.preventDefault();
        // eslint-disable-next-line no-param-reassign
        e.returnValue = '';
      }
    }
  });
}

// mount on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else mount();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        // eslint-disable-next-line no-console
        console.log('ServiceWorker registered:', registration);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

export { notesStore, archivedStore };

