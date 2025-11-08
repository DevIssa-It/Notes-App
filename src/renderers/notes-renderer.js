/**
 * Notes Renderer - Handles rendering of notes to DOM
 */

import { FILTERS } from '../constants.js';
import { isNotePinned, isNoteFavorited } from '../handlers/note-handlers.js';

// Current state
let currentSearchQuery = '';
let currentFilter = FILTERS.ALL;
let currentSort = 'date-desc'; // Default sort

/**
 * Set current sort option
 * @param {string} sort - Sort option
 */
export function setCurrentSort(sort) {
  currentSort = sort;
}

/**
 * Get current sort option
 * @returns {string} Current sort
 */
export function getCurrentSort() {
  return currentSort;
}

/**
 * Set current search query
 * @param {string} query - Search query
 */
export function setSearchQuery(query) {
  currentSearchQuery = query;
}

/**
 * Get current search query
 * @returns {string} Current search query
 */
export function getSearchQuery() {
  return currentSearchQuery;
}

/**
 * Set current filter
 * @param {string} filter - Filter type
 */
export function setCurrentFilter(filter) {
  currentFilter = filter;
}

/**
 * Get current filter
 * @returns {string} Current filter
 */
export function getCurrentFilter() {
  return currentFilter;
}

/**
 * Render notes to container
 * @param {HTMLElement} container - Container element
 * @param {Array} notes - Array of notes
 */
export function renderNotes(container, notes) {
  container.innerHTML = '';
  let arr = [...notes];

  // Filter by search query
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    arr = arr.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  // If archived filter is active, show only archived notes
  if (currentFilter === FILTERS.ARCHIVED) {
    arr = arr.filter((n) => n.archived);
  }

  if (arr.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color: var(--text-secondary);">
        <i class="fas fa-inbox" style="font-size:3rem; margin-bottom:1rem;"></i>
        <p>No notes found</p>
      </div>
    `;
    return;
  }

  // Sort notes: pinned notes first, then by creation date
  arr.sort((a, b) => {
    const aPinned = isNotePinned(a.id);
    const bPinned = isNotePinned(b.id);
    
    // Pinned notes always first
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    
    // Apply selected sort for non-pinned or both pinned
    switch (currentSort) {
      case 'date-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'date-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'length-desc':
        return b.body.length - a.body.length;
      case 'length-asc':
        return a.body.length - b.body.length;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  arr.forEach((noteData) => {
    const noteItem = document.createElement('note-item');
    // Add pinned and favorited properties to note data
    noteItem.note = {
      ...noteData,
      pinned: isNotePinned(noteData.id),
      favorited: isNoteFavorited(noteData.id),
    };
    container.appendChild(noteItem);
  });
}

/**
 * Render archived section
 * @param {HTMLElement} container - Container element
 * @param {Array} archivedNotes - Array of archived notes
 */
export function renderArchivedSection(container, archivedNotes) {
  container.innerHTML = '';
  let arr = [...archivedNotes];

  // Filter by search query
  if (currentSearchQuery) {
    const query = currentSearchQuery.toLowerCase();
    arr = arr.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  if (arr.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem; color: var(--text-secondary);">
        <i class="fas fa-archive" style="font-size:3rem; margin-bottom:1rem;"></i>
        <p>No archived notes</p>
      </div>
    `;
    return;
  }

  arr.forEach((noteData) => {
    const noteItem = document.createElement('note-item');
    noteItem.note = noteData;
    container.appendChild(noteItem);
  });
}

/**
 * Update archived count badge
 * @param {number} count - Archived count
 */
export function updateArchivedCount(count) {
  const archivedCountEl = document.getElementById('archivedCount');
  if (archivedCountEl) {
    archivedCountEl.textContent = count;
  }
}

/**
 * Update statistics component
 * @param {Object} stats - Statistics object
 */
export function updateStats(stats) {
  const statsComponent = document.querySelector('note-stats');
  if (statsComponent) {
    statsComponent.activeCount = stats.activeCount;
    statsComponent.archivedCount = stats.archivedCount;
    statsComponent.totalCount = stats.totalCount;
  }
}
