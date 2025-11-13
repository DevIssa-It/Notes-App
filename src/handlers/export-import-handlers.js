/**
 * Export/Import Handlers - Handle export and import of notes
 */

import { getActiveNotes, getArchivedNotes } from '../state/notes-store.js';
import { showSuccess, showError } from '../ui-helpers.js';

/**
 * Export notes as JSON
 * @param {Array} activeNotes - Active notes array
 * @param {Array} archivedNotes - Archived notes array
 * @returns {string} JSON string
 */
function exportAsJSON(activeNotes, archivedNotes) {
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
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export notes as plain text
 * @param {Array} notes - Notes array
 * @returns {string} Plain text content
 */
function exportAsText(notes) {
  const lines = [
    '=' .repeat(60),
    'NOTES BACKUP',
    `Exported: ${new Date().toLocaleString()}`,
    `Total Notes: ${notes.length}`,
    '='.repeat(60),
    '',
  ];
  
  notes.forEach((note, index) => {
    lines.push(`[${index + 1}] ${note.title}`);
    lines.push('-'.repeat(60));
    lines.push(`Created: ${new Date(note.createdAt).toLocaleString()}`);
    lines.push(`Status: ${note.archived ? 'Archived' : 'Active'}`);
    lines.push('');
    lines.push(note.body);
    lines.push('');
    lines.push('='.repeat(60));
    lines.push('');
  });
  
  return lines.join('\n');
}

/**
 * Export notes as Markdown
 * @param {Array} notes - Notes array
 * @returns {string} Markdown content
 */
function exportAsMarkdown(notes) {
  const lines = [
    '# 📝 Notes Backup',
    '',
    `**Exported:** ${new Date().toLocaleString()}  `,
    `**Total Notes:** ${notes.length}`,
    '',
    '---',
    '',
  ];
  
  notes.forEach((note, index) => {
    const status = note.archived ? '🗄️ Archived' : '✅ Active';
    const date = new Date(note.createdAt).toLocaleString();
    
    lines.push(`## ${index + 1}. ${note.title}`);
    lines.push('');
    lines.push(`> **Status:** ${status}  `);
    lines.push(`> **Created:** ${date}`);
    lines.push('');
    lines.push(note.body);
    lines.push('');
    lines.push('---');
    lines.push('');
  });
  
  return lines.join('\n');
}

/**
 * Download file to user's computer
 * @param {string} content - File content
 * @param {string} mimeType - MIME type
 * @param {string} extension - File extension
 */
function downloadFile(content, mimeType, extension) {
  const dataBlob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `notes-backup-${timestamp}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export notes in specified format
 * @param {string} format - Export format: 'json', 'txt', or 'markdown'
 */
export function exportNotes(format = 'json') {
  try {
    const activeNotes = getActiveNotes();
    const archivedNotes = getArchivedNotes();
    const allNotes = [...activeNotes, ...archivedNotes];
    
    let content;
    let mimeType;
    let extension;
    
    switch (format.toLowerCase()) {
      case 'txt':
        content = exportAsText(allNotes);
        mimeType = 'text/plain';
        extension = 'txt';
        break;
        
      case 'markdown':
      case 'md':
        content = exportAsMarkdown(allNotes);
        mimeType = 'text/markdown';
        extension = 'md';
        break;
        
      case 'json':
      default:
        content = exportAsJSON(activeNotes, archivedNotes);
        mimeType = 'application/json';
        extension = 'json';
        break;
    }
    
    downloadFile(content, mimeType, extension);
    
    showSuccess(
      'Export Successful!',
      `Exported ${allNotes.length} notes as ${format.toUpperCase()} successfully.`
    );
  } catch (error) {
    showError('Export Failed', error);
  }
}

/**
 * Export all notes to JSON file
 */
export function handleExportNotes() {
  exportNotes('json');
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
