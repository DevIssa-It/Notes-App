/**
 * Backup and Restore Handlers
 * Handle automatic and manual backup/restore operations
 */

import { getActiveNotes, getArchivedNotes } from '../state/notes-store.js';
import { showSuccess, showError, showConfirm } from '../ui-helpers.js';

const DB_NAME = 'NotesAppBackup';
const DB_VERSION = 1;
const STORE_NAME = 'backups';
const MAX_AUTO_BACKUPS = 10;

/**
 * Open IndexedDB connection
 * @returns {Promise<IDBDatabase>} Database connection
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

/**
 * Save backup to IndexedDB
 * @param {Object} backupData - Backup data
 * @param {string} type - Backup type ('auto' or 'manual')
 * @returns {Promise<void>}
 */
async function saveBackupToDB(backupData, type = 'manual') {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const backup = {
      data: backupData,
      timestamp: new Date().toISOString(),
      type,
      version: '1.0',
    };

    store.add(backup);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    throw new Error(`Failed to save backup: ${error.message}`);
  }
}

/**
 * Get all backups from IndexedDB
 * @returns {Promise<Array>} Array of backups
 */
async function getBackupsFromDB() {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    throw new Error(`Failed to retrieve backups: ${error.message}`);
  }
}

/**
 * Delete old auto-backups, keeping only the latest MAX_AUTO_BACKUPS
 */
async function cleanupOldBackups() {
  try {
    const backups = await getBackupsFromDB();
    const autoBackups = backups
      .filter((b) => b.type === 'auto')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (autoBackups.length <= MAX_AUTO_BACKUPS) return;

    const toDelete = autoBackups.slice(MAX_AUTO_BACKUPS);
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    toDelete.forEach((backup) => {
      store.delete(backup.id);
    });

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => db.close();
  } catch (error) {
    // Silent cleanup error
  }
}

/**
 * Create backup data object
 * @returns {Object} Backup data
 */
function createBackupData() {
  const activeNotes = getActiveNotes();
  const archivedNotes = getArchivedNotes();

  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
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
}

/**
 * Auto-backup to IndexedDB
 * Called periodically or on important events
 */
export async function autoBackup() {
  try {
    const backupData = createBackupData();
    await saveBackupToDB(backupData, 'auto');
    await cleanupOldBackups();
  } catch (error) {
    // Silent auto-backup error
  }
}

/**
 * Manual backup - saves to IndexedDB and downloads file
 * @returns {Promise<void>}
 */
export async function handleManualBackup() {
  try {
    const backupData = createBackupData();
    
    // Save to IndexedDB
    await saveBackupToDB(backupData, 'manual');
    
    // Download backup file
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `notes-manual-backup-${timestamp}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    showSuccess(
      'Backup Created!',
      `Backed up ${backupData.metadata.totalNotes} notes successfully.`
    );
  } catch (error) {
    showError('Backup Failed', error);
  }
}

/**
 * List all available backups
 * @returns {Promise<Array>} Array of backup metadata
 */
export async function listBackups() {
  try {
    const backups = await getBackupsFromDB();
    return backups
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((b) => ({
        id: b.id,
        timestamp: b.timestamp,
        type: b.type,
        totalNotes: b.data.metadata?.totalNotes || 0,
        activeCount: b.data.metadata?.activeCount || 0,
        archivedCount: b.data.metadata?.archivedCount || 0,
      }));
  } catch (error) {
    showError('Failed to list backups', error);
    return [];
  }
}

/**
 * Restore from a specific backup
 * @param {number} backupId - Backup ID
 * @param {Function} onSuccess - Success callback
 * @returns {Promise<void>}
 */
export async function handleRestoreBackup(backupId, onSuccess) {
  try {
    const backups = await getBackupsFromDB();
    const backup = backups.find((b) => b.id === backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }

    const confirmed = await showConfirm(
      'Restore Backup?',
      `This will restore ${backup.data.metadata?.totalNotes || 0} notes from ${new Date(backup.timestamp).toLocaleString()}. Current notes will be replaced. Continue?`
    );

    if (!confirmed) return;

    // Dispatch restore event with backup data
    const event = new CustomEvent('notes-restore', {
      detail: { data: backup.data },
      bubbles: true,
      composed: true,
    });
    document.body.dispatchEvent(event);

    if (onSuccess) onSuccess(backup.data);
    
    showSuccess(
      'Restore Successful!',
      `Restored ${backup.data.metadata?.totalNotes || 0} notes from backup.`
    );
  } catch (error) {
    showError('Restore Failed', error);
  }
}

/**
 * Delete a specific backup
 * @param {number} backupId - Backup ID
 */
export async function deleteBackup(backupId) {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    store.delete(backupId);

    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        db.close();
        showSuccess('Backup Deleted', 'Backup removed successfully.');
        resolve();
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  } catch (error) {
    showError('Delete Failed', error);
  }
}

/**
 * Initialize auto-backup system
 * Sets up periodic auto-backups
 */
export function initAutoBackup() {
  // Auto-backup every 5 minutes
  setInterval(autoBackup, 5 * 60 * 1000);
  
  // Initial auto-backup after 30 seconds
  setTimeout(autoBackup, 30 * 1000);
}
