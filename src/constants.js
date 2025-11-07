/**
 * Application constants
 * Centralized configuration for the Notes App
 */

// UI Messages
export const MESSAGES = {
  LOADING: {
    DEFAULT: 'Loading...',
    NOTES: 'Loading notes...',
    CREATING: 'Creating note...',
    UPDATING: 'Updating note...',
    DELETING: 'Deleting note...',
    ARCHIVING: 'Archiving note...',
    UNARCHIVING: 'Unarchiving note...',
    RESTORING: 'Restoring note...',
    EXPORTING: 'Exporting notes...',
    IMPORTING: 'Importing notes...',
  },
  SUCCESS: {
    NOTE_CREATED: 'Note created successfully!',
    NOTE_UPDATED: 'Note updated successfully!',
    NOTE_DELETED: 'Note deleted!',
    NOTE_RESTORED: 'Note restored!',
    NOTE_ARCHIVED: 'Note archived!',
    NOTE_UNARCHIVED: 'Note unarchived!',
    ALL_RESTORED: 'All notes restored!',
    ALL_DELETED: 'All archived notes deleted!',
    EXPORTED: 'Notes exported successfully!',
  },
  ERROR: {
    LOAD_FAILED: 'Failed to load notes',
    CREATE_FAILED: 'Failed to create note',
    UPDATE_FAILED: 'Failed to update note',
    DELETE_FAILED: 'Failed to delete note',
    ARCHIVE_FAILED: 'Failed to archive note',
    UNARCHIVE_FAILED: 'Failed to unarchive note',
    RESTORE_FAILED: 'Failed to restore note',
    EXPORT_FAILED: 'Failed to export notes',
    IMPORT_FAILED: 'Failed to import notes',
    NO_ARCHIVED_NOTES: 'There are no archived notes',
    IMPORT_NOT_AVAILABLE: 'Import feature is disabled when using API mode',
  },
  CONFIRM: {
    DELETE_TITLE: 'Are you sure?',
    DELETE_TEXT: "You won't be able to revert this!",
    DELETE_ALL_TITLE: 'Delete All Archived Notes?',
    DELETE_ALL_TEXT: 'This action cannot be undone!',
    YES_DELETE: 'Yes, delete it!',
    CANCEL: 'Cancel',
  },
  WAIT: 'Please wait',
};

// UI Timing
export const TIMING = {
  SUCCESS_TOAST: 2000, // 2 seconds
  UNDO_TIMEOUT: 5000, // 5 seconds
  DEBOUNCE_SEARCH: 300, // 300ms
  ANIMATION_DURATION: 250, // 250ms
};

// UI Colors
export const COLORS = {
  PRIMARY: '#7c3aed',
  DANGER: '#dc2626',
  SECONDARY: '#64748b',
  THEME: {
    LIGHT: {
      BACKGROUND: '#ffffff',
      TEXT: '#0f172a',
    },
    DARK: {
      BACKGROUND: '#1e293b',
      TEXT: '#e6eef8',
    },
  },
};

// Filter Types
export const FILTERS = {
  ALL: 'all',
  ARCHIVED: 'archived',
};

// DOM Selectors (for commonly used elements)
export const SELECTORS = {
  LOADING_INDICATOR: 'loading-indicator',
  NOTE_STATS: 'note-stats',
  NOTE_INPUT: 'note-input',
  NOTE_DETAIL: 'note-detail',
  NOTES_GRID: '#notesGrid',
  ARCHIVED_GRID: '#archivedGrid',
  ARCHIVED_COUNT: '#archivedCount',
  FILTER_BTN: '.filter-btn',
  MAIN_CONTAINER: 'main',
  NOTE_DETAIL_CONTAINER: '#noteDetailContainer',
};

// Validation Rules
export const VALIDATION = {
  NOTE_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  NOTE_BODY: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
};

// Service Worker
export const SERVICE_WORKER = {
  PATH: '/service-worker.js',
};

// Export format
export const EXPORT = {
  FILENAME: 'notes-backup.json',
  MIME_TYPE: 'application/json',
};
