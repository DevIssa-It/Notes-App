/**
 * Note Handlers - Event handlers for note operations
 */

import NotesAPI from '../api.js';
import { MESSAGES } from '../constants.js';
import { showError, showSuccess, showSuccessWithUndo, LoadingManager } from '../ui-helpers.js';
import {
  addNote,
  deleteNote,
  getNoteById,
  archiveNote as archiveNoteInStore,
  unarchiveNote as unarchiveNoteInStore,
} from '../state/notes-store.js';
import vercelAnalytics from '../vercel-analytics.js';

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
    
    // Fetch the complete note from API to ensure we have all data
    const completeNote = await NotesAPI.getSingleNote(newNote.id);
    addNote(completeNote);
    showSuccess(MESSAGES.SUCCESS.NOTE_CREATED);
    
    // Track analytics
    vercelAnalytics.trackNoteCreated();
    
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.CREATE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Handle note update
 * Uses delete + create strategy since Dicoding API doesn't support PUT
 * @param {string} id - Note ID
 * @param {Object} updates - Note updates
 * @param {Function} onSuccess - Success callback
 */
export async function handleUpdateNote(id, updates, onSuccess) {
  try {
    loadingManager.show(MESSAGES.LOADING.UPDATING, 'Saving changes');
    
    // Get the original note to check if it's archived
    const originalNote = getNoteById(id);
    if (!originalNote) {
      throw new Error('Note not found');
    }
    
    const wasArchived = originalNote.archived || false;
    
    // Delete old note and create new one (API workaround)
    const updatedNote = await NotesAPI.updateNote(
      id, 
      {
        title: updates.title,
        body: updates.body,
      },
      wasArchived
    );
    
    if (!updatedNote || !updatedNote.id) {
      throw new Error('Failed to update note');
    }
    
    // Remove old note from store
    deleteNote(id);
    
    // Add updated note to correct store based on archived status
    // The note from API already has the correct archived property
    // Add lastModified timestamp
    updatedNote.lastModified = new Date().toISOString();
    
    if (updatedNote.archived) {
      // For archived notes, we need to add to active store first, then move to archived
      addNote(updatedNote);
      archiveNoteInStore(updatedNote.id);
    } else {
      addNote(updatedNote);
    }
    
    showSuccess(MESSAGES.SUCCESS.NOTE_UPDATED);
    if (onSuccess) onSuccess(updatedNote);
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
    
    // Track analytics
    vercelAnalytics.trackNoteDeleted();

    // Show success with undo option
    showSuccessWithUndo(MESSAGES.SUCCESS.NOTE_DELETED, async () => {
      try {
        loadingManager.show(MESSAGES.LOADING.RESTORING, MESSAGES.WAIT);
        const restored = await NotesAPI.createNote({
          title: deletedNote.title,
          body: deletedNote.body,
        });
        
        if (!restored || !restored.id) {
          throw new Error('Failed to restore note');
        }
        
        if (wasArchived) {
          await NotesAPI.archiveNote(restored.id);
          // Fetch complete note after archiving
          const completeNote = await NotesAPI.getSingleNote(restored.id);
          archiveNoteInStore(completeNote.id);
        } else {
          // Fetch complete note
          const completeNote = await NotesAPI.getSingleNote(restored.id);
          addNote(completeNote);
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
    
    // Move note to archived store locally
    archiveNoteInStore(id);
    
    // Track analytics
    vercelAnalytics.trackNoteArchived();
    
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
    
    // Move note to active store locally
    unarchiveNoteInStore(id);
    
    showSuccess(MESSAGES.SUCCESS.NOTE_UNARCHIVED);
    if (onSuccess) onSuccess();
  } catch (error) {
    showError(MESSAGES.ERROR.UNARCHIVE_FAILED, error);
  } finally {
    loadingManager.hide();
  }
}

/**
 * Get pinned notes from localStorage
 * @returns {Set<string>} Set of pinned note IDs
 */
function getPinnedNotes() {
  try {
    const pinned = localStorage.getItem('pinnedNotes');
    return pinned ? new Set(JSON.parse(pinned)) : new Set();
  } catch (error) {
    console.error('Failed to load pinned notes:', error);
    return new Set();
  }
}

/**
 * Save pinned notes to localStorage
 * @param {Set<string>} pinnedSet - Set of pinned note IDs
 */
function savePinnedNotes(pinnedSet) {
  try {
    localStorage.setItem('pinnedNotes', JSON.stringify([...pinnedSet]));
  } catch (error) {
    console.error('Failed to save pinned notes:', error);
  }
}

/**
 * Check if a note is pinned
 * @param {string} id - Note ID
 * @returns {boolean} True if pinned
 */
export function isNotePinned(id) {
  const pinned = getPinnedNotes();
  return pinned.has(id);
}

/**
 * Handle note pinning
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export function handlePinNote(id, onSuccess) {
  const pinned = getPinnedNotes();
  pinned.add(id);
  savePinnedNotes(pinned);
  showSuccess('📌 Note pinned to top');
  if (onSuccess) onSuccess();
}

/**
 * Handle note unpinning
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export function handleUnpinNote(id, onSuccess) {
  const pinned = getPinnedNotes();
  pinned.delete(id);
  savePinnedNotes(pinned);
  showSuccess('Note unpinned');
  if (onSuccess) onSuccess();
}

/**
 * Get favorited notes from localStorage
 * @returns {Set<string>} Set of favorited note IDs
 */
function getFavoritedNotes() {
  try {
    const favorited = localStorage.getItem('favoritedNotes');
    return favorited ? new Set(JSON.parse(favorited)) : new Set();
  } catch (error) {
    console.error('Failed to load favorited notes:', error);
    return new Set();
  }
}

/**
 * Save favorited notes to localStorage
 * @param {Set<string>} favoritedSet - Set of favorited note IDs
 */
function saveFavoritedNotes(favoritedSet) {
  try {
    localStorage.setItem('favoritedNotes', JSON.stringify([...favoritedSet]));
  } catch (error) {
    console.error('Failed to save favorited notes:', error);
  }
}

/**
 * Check if a note is favorited
 * @param {string} id - Note ID
 * @returns {boolean} True if favorited
 */
export function isNoteFavorited(id) {
  const favorited = getFavoritedNotes();
  return favorited.has(id);
}

/**
 * Handle note favoriting
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export function handleFavoriteNote(id, onSuccess) {
  const favorited = getFavoritedNotes();
  favorited.add(id);
  saveFavoritedNotes(favorited);
  showSuccess('❤️ Added to favorites');
  if (onSuccess) onSuccess();
}

/**
 * Handle note unfavoriting
 * @param {string} id - Note ID
 * @param {Function} onSuccess - Success callback
 */
export function handleUnfavoriteNote(id, onSuccess) {
  const favorited = getFavoritedNotes();
  favorited.delete(id);
  saveFavoritedNotes(favorited);
  showSuccess('Removed from favorites');
  if (onSuccess) onSuccess();
}
