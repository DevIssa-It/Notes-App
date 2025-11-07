/**
 * Bulk Handlers - Bulk operations for notes
 */

import NotesAPI from '../api.js';
import { MESSAGES } from '../constants.js';
import { showError, showSuccess, showConfirm, LoadingManager } from '../ui-helpers.js';
import {
  getArchivedNotes,
  deleteNote,
  unarchiveNote,
} from '../state/notes-store.js';

const loadingManager = new LoadingManager();

/**
 * Handle restore all archived notes
 * @param {Function} onSuccess - Success callback
 */
export async function handleRestoreAll(onSuccess) {
  const archivedNotes = getArchivedNotes();
  
  if (archivedNotes.length === 0) {
    showError(MESSAGES.ERROR.NO_ARCHIVED_NOTES);
    return;
  }

  try {
    loadingManager.show(
      'Restoring all notes...',
      `Processing ${archivedNotes.length} notes`
    );
    
    // Unarchive all notes
    await Promise.all(
      archivedNotes.map(async (note) => {
        await NotesAPI.unarchiveNote(note.id);
        unarchiveNote(note.id);
      })
    );
    
    showSuccess(MESSAGES.SUCCESS.ALL_RESTORED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError('Failed to restore all notes', error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle delete all archived notes
 * @param {Function} onSuccess - Success callback
 */
export async function handleDeleteAll(onSuccess) {
  const archivedNotes = getArchivedNotes();
  
  if (archivedNotes.length === 0) {
    showError(MESSAGES.ERROR.NO_ARCHIVED_NOTES);
    return;
  }

  const confirmed = await showConfirm(
    'Delete all archived notes?',
    `This will permanently delete ${archivedNotes.length} archived notes!`,
    'Yes, delete all!'
  );

  if (!confirmed) return;

  try {
    loadingManager.show(
      'Deleting all archived notes...',
      `Processing ${archivedNotes.length} notes`
    );
    
    // Delete all archived notes
    await Promise.all(
      archivedNotes.map(async (note) => {
        await NotesAPI.deleteNote(note.id);
        deleteNote(note.id);
      })
    );
    
    showSuccess(MESSAGES.SUCCESS.ALL_DELETED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError('Failed to delete all notes', error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle export notes
 */
export async function handleExportNotes() {
  try {
    loadingManager.show(MESSAGES.LOADING.EXPORTING, 'Preparing download');
    const notes = await NotesAPI.getNotes();
    const archivedNotes = await NotesAPI.getArchivedNotes();
    const allNotes = [...notes, ...archivedNotes];

    const dataStr = JSON.stringify(allNotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showSuccess(MESSAGES.SUCCESS.EXPORTED);
  } catch (err) {
    showError('Export failed', err);
  } finally {
    loadingManager.hide();
  }
}
