/**
 * Notes Store - Centralized state management for notes
 */

import NotesAPI from '../api.js';
import { MESSAGES } from '../constants.js';
import { showError } from '../ui-helpers.js';

// State
const notesStore = new Map();
const archivedStore = new Map();

/**
 * Get all active notes
 * @returns {Array} Array of active notes
 */
export function getActiveNotes() {
  return Array.from(notesStore.values());
}

/**
 * Get all archived notes
 * @returns {Array} Array of archived notes
 */
export function getArchivedNotes() {
  return Array.from(archivedStore.values());
}

/**
 * Get note by ID (from both stores)
 * @param {string} id - Note ID
 * @returns {Object|undefined} Note object or undefined
 */
export function getNoteById(id) {
  return notesStore.get(id) || archivedStore.get(id);
}

/**
 * Add note to active store
 * @param {Object} note - Note object
 */
export function addNote(note) {
  notesStore.set(note.id, { ...note, archived: false });
}

/**
 * Update note in store
 * @param {string} id - Note ID
 * @param {Object} updates - Note updates
 */
export function updateNote(id, updates) {
  const note = getNoteById(id);
  if (note) {
    const store = note.archived ? archivedStore : notesStore;
    store.set(id, { ...note, ...updates });
  }
}

/**
 * Delete note from store
 * @param {string} id - Note ID
 */
export function deleteNote(id) {
  notesStore.delete(id);
  archivedStore.delete(id);
}

/**
 * Move note to archived store
 * @param {string} id - Note ID
 */
export function archiveNote(id) {
  const note = notesStore.get(id);
  if (note) {
    notesStore.delete(id);
    archivedStore.set(id, { ...note, archived: true });
  }
}

/**
 * Move note to active store
 * @param {string} id - Note ID
 */
export function unarchiveNote(id) {
  const note = archivedStore.get(id);
  if (note) {
    archivedStore.delete(id);
    notesStore.set(id, { ...note, archived: false });
  }
}

/**
 * Clear all stores
 */
export function clearAllStores() {
  notesStore.clear();
  archivedStore.clear();
}

/**
 * Get statistics
 * @returns {Object} Statistics object
 */
export function getStats() {
  return {
    activeCount: notesStore.size,
    archivedCount: archivedStore.size,
    totalCount: notesStore.size + archivedStore.size,
  };
}

/**
 * Load notes from API
 * @returns {Promise<boolean>} True if successful
 */
export async function loadNotesFromAPI() {
  try {
    const notes = await NotesAPI.getNotes();
    const archivedNotes = await NotesAPI.getArchivedNotes();

    clearAllStores();

    notes.forEach((n) => notesStore.set(n.id, { ...n, archived: false }));
    archivedNotes.forEach((n) => archivedStore.set(n.id, { ...n, archived: true }));

    return true;
  } catch (error) {
    showError(MESSAGES.ERROR.LOAD_FAILED, error);
    return false;
  }
}
