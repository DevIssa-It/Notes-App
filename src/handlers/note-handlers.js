/**
 * Note Handlers - Event handlers for note operations
 */

import NotesAPI from '../api.js';
import { MESSAGES } from '../constants.js';
import { showError, showSuccess, showSuccessWithUndo, LoadingManager } from '../ui-helpers.js';
import {
  addNote,
  updateNote,
  deleteNote,
  getNoteById,
  archiveNote as archiveNoteInStore,
  unarchiveNote as unarchiveNoteInStore,
} from '../state/notes-store.js';

const loadingManager = new LoadingManager();

/**
 * Handle note creation
 * @param {Object} detail - Event detail with title and body
 * @param {Function} onSuccess - Success callback
 */
export async function handleCreateNote(detail, onSuccess) {
  try {
    loadingManager.show(MESSAGES.LOADING.CREATING, 'Saving to server');
    const newNote = await NotesAPI.createNote({
      title: detail.title,
      body: detail.body,
    });
    
    if (!newNote || !newNote.id) {
      throw new Error('Invalid note returned from API');
    }
    
    addNote(newNote);
    showSuccess(MESSAGES.SUCCESS.NOTE_CREATED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.CREATE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle note update
 * @param {string} id - Note ID
 * @param {Object} updates - Note updates
 * @param {Function} onSuccess - Success callback
 */
export async function handleUpdateNote(id, updates, onSuccess) {
  try {
    loadingManager.show(MESSAGES.LOADING.UPDATING, 'Saving changes');
    await NotesAPI.updateNote(id, {
      title: updates.title,
      body: updates.body,
    });
    updateNote(id, updates);
    showSuccess(MESSAGES.SUCCESS.NOTE_UPDATED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.UPDATE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle note deletion with undo
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export async function handleDeleteNote(id, onSuccess) {
  const deletedNote = getNoteById(id);
  if (!deletedNote) return;

  const wasArchived = deletedNote.archived || false;

  try {
    loadingManager.show(MESSAGES.LOADING.DELETING, MESSAGES.WAIT);
    await NotesAPI.deleteNote(id);
    deleteNote(id);
    loadingManager.hide();

    // Show success with undo option
    showSuccessWithUndo(MESSAGES.SUCCESS.NOTE_DELETED, async () => {
      try {
        loadingManager.show(MESSAGES.LOADING.RESTORING, MESSAGES.WAIT);
        const restored = await NotesAPI.createNote(
          deletedNote.title,
          deletedNote.body
        );
        if (wasArchived) {
          await NotesAPI.archiveNote(restored.id);
          archiveNoteInStore(restored.id);
        } else {
          addNote(restored);
        }
        showSuccess(MESSAGES.SUCCESS.NOTE_RESTORED);
        if (onSuccess) onSuccess();
      } catch (error) {
        showError(MESSAGES.ERROR.RESTORE_FAILED, error);
      } finally {
        loadingManager.hide();
      }
    });

    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.DELETE_FAILED, error);
    loadingManager.hide();
  }
}

/**
 * Handle note archiving
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export async function handleArchiveNote(id, onSuccess) {
  try {
    loadingManager.show(MESSAGES.LOADING.ARCHIVING, MESSAGES.WAIT);
    await NotesAPI.archiveNote(id);
    archiveNoteInStore(id);
    showSuccess(MESSAGES.SUCCESS.NOTE_ARCHIVED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.ARCHIVE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle note unarchiving
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export async function handleUnarchiveNote(id, onSuccess) {
  try {
    loadingManager.show(MESSAGES.LOADING.UNARCHIVING, MESSAGES.WAIT);
    await NotesAPI.unarchiveNote(id);
    unarchiveNoteInStore(id);
    showSuccess(MESSAGES.SUCCESS.NOTE_UNARCHIVED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.UNARCHIVE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}
