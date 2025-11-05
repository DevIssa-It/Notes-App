import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/note-list.js';
import './components/loading-indicator.js';
import './components/search-bar.js';
import NotesAPI from './api.js';
import Swal from 'sweetalert2';

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

// Helper function to show error
function showError(message, error) {
  console.error(message, error);
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    footer: error ? `<small>${error.message}</small>` : '',
    confirmButtonColor: '#7c3aed',
    background: '#1e293b',
    color: '#e6eef8',
  });
}

// Helper function to show success
function showSuccess(message) {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: 2000,
    showConfirmButton: false,
    background: '#1e293b',
    color: '#e6eef8',
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
      container.innerHTML = `<p style="color: #94a3b8; text-align: center; padding: 40px;">No notes found for "${currentSearchQuery}"</p>`;
    } else {
      container.innerHTML =
        '<p style="color: #94a3b8; text-align: center; padding: 40px;">No notes yet. Create your first note!</p>';
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
      container.innerHTML = `<p style="color: #94a3b8; text-align: center; padding: 20px;">No archived notes found for "${currentSearchQuery}"</p>`;
    } else {
      container.innerHTML =
        '<p style="color: #94a3b8; text-align: center; padding: 20px;">No archived notes</p>';
    }
  }
}

function updateArchivedCount() {
  const cnt = archivedStore.size;
  const span = document.getElementById('archivedCount');
  if (span) span.textContent = String(cnt);
}

function setFilter(filter) {
  currentFilter = filter === 'archived' ? 'archived' : 'all';
  const notesGrid = document.getElementById('notesGrid');
  const archivedGrid = document.getElementById('archivedGrid');
  renderNotes(notesGrid);
  renderArchivedSection(archivedGrid);
  updateArchivedCount();
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
  updateArchivedCount();

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
      updateArchivedCount();
    } catch (error) {
      showError('Failed to process note', error);
    } finally {
      hideLoading();
    }
  });

  document.body.addEventListener('note-delete', async (e) => {
    const { id } = e.detail;

    // Confirm before deleting
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#e6eef8',
    });

    if (result.isConfirmed) {
      try {
        showLoading('Deleting note...', 'Please wait');
        await NotesAPI.deleteNote(id);
        notesStore.delete(id);
        archivedStore.delete(id);
        renderNotes(notesGrid);
        renderArchivedSection(archivedGrid);
        updateArchivedCount();
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
        Swal.fire({
          icon: 'info',
          title: 'No archived notes',
          text: 'There are no archived notes to restore',
          background: '#1e293b',
          color: '#e6eef8',
        });
        return;
      }

      try {
        showLoading(
          'Restoring all notes...',
          `Processing ${archivedIds.length} notes`
        );
        // Unarchive all notes
        for (const id of archivedIds) {
          await NotesAPI.unarchiveNote(id);
          const note = archivedStore.get(id);
          archivedStore.delete(id);
          notesStore.set(id, { ...note, archived: false });
        }
        renderNotes(notesGrid);
        renderArchivedSection(archivedGrid);
        updateArchivedCount();
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
        Swal.fire({
          icon: 'info',
          title: 'No archived notes',
          text: 'There are no archived notes to delete',
          background: '#1e293b',
          color: '#e6eef8',
        });
        return;
      }

      const result = await Swal.fire({
        title: 'Delete all archived notes?',
        text: `This will permanently delete ${archivedIds.length} archived notes!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete all!',
        background: '#1e293b',
        color: '#e6eef8',
      });

      if (result.isConfirmed) {
        try {
          showLoading(
            'Deleting all archived notes...',
            `Processing ${archivedIds.length} notes`
          );
          for (const id of archivedIds) {
            await NotesAPI.deleteNote(id);
            archivedStore.delete(id);
          }
          renderNotes(notesGrid);
          renderArchivedSection(archivedGrid);
          updateArchivedCount();
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

  document.body.addEventListener('import-notes', (e) => {
    Swal.fire({
      icon: 'info',
      title: 'Import Not Available',
      text: 'Import feature is disabled when using API mode. Please use the API to manage your notes.',
      background: '#1e293b',
      color: '#e6eef8',
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
}

// mount on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else mount();

export { notesStore, archivedStore };
