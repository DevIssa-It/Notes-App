/**
 * Export/Import Handlers - Handle export and import of notes
 */

import { getActiveNotes, getArchivedNotes } from '../state/notes-store.js';
import { showSuccess, showError } from '../ui-helpers.js';

/**
 * Export all notes to JSON file
 */
export function handleExportNotes() {
  try {
    const activeNotes = getActiveNotes();
    const archivedNotes = getArchivedNotes();
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      notes: {
        active: activeNotes,
        archived: archivedNotes,
      },
      metadata: {
        totalNotes: activeNotes.length + archivedNotes.length,
        activeCount: activeNotes.length,
        archivedCount: archivedNotes.length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    showSuccess(
      'Export Successful!',
      `Exported ${exportData.metadata.totalNotes} notes successfully.`
    );
  } catch (error) {
    showError('Export Failed', error);
  }
}

/**
 * Validate import data structure
 * @param {Object} data - Import data
 * @returns {boolean} True if valid
 */
function validateImportData(data) {
  if (!data || typeof data !== 'object') return false;
  if (!data.notes || typeof data.notes !== 'object') return false;
  if (!Array.isArray(data.notes.active) || !Array.isArray(data.notes.archived)) return false;
  
  return true;
}

/**
 * Handle import notes from JSON file
 * @param {File} file - JSON file to import
 * @param {Function} onSuccess - Success callback
 */
export function handleImportNotes(file, onSuccess) {
  if (!file) {
    showError('Import Error', new Error('No file selected'));
    return;
  }

  if (!file.name.endsWith('.json')) {
    showError('Import Error', new Error('Please select a valid JSON file'));
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      
      if (!validateImportData(data)) {
        throw new Error('Invalid file format. Please select a valid Notes App backup file.');
      }

      // Show import preview/confirmation
      const totalNotes = data.metadata?.totalNotes || 
        (data.notes.active.length + data.notes.archived.length);
      
      showSuccess(
        'Import Preview',
        `File contains ${totalNotes} notes (${data.notes.active.length} active, ${data.notes.archived.length} archived). 
        <br><br><strong>Note:</strong> Importing will add these notes to the API. Duplicates may occur.`,
        true // Allow HTML
      );

      // Dispatch import event with data
      const event = new CustomEvent('notes-import-ready', {
        detail: {
          data,
          file: file.name,
        },
        bubbles: true,
        composed: true,
      });
      document.body.dispatchEvent(event);

      if (onSuccess) onSuccess(data);
    } catch (error) {
      showError('Import Failed', error);
    }
  };

  reader.onerror = () => {
    showError('Import Error', new Error('Failed to read file'));
  };

  reader.readAsText(file);
}

/**
 * Process import and add notes to API
 * @param {Object} importData - Import data object
 * @param {Function} onComplete - Completion callback
 */
export async function processImport(importData, onComplete) {
  // This will be implemented to integrate with API
  // For now, we dispatch an event that app.js can handle
  const event = new CustomEvent('process-import', {
    detail: { data: importData },
    bubbles: true,
    composed: true,
  });
  document.body.dispatchEvent(event);
  
  if (onComplete) onComplete();
}
