/**
 * Sync Queue
 * Queue and sync operations when offline
 */

import NotesAPI from './api.js';

class SyncQueue {
  constructor() {
    this.queue = this.loadQueue();
    this.isSyncing = false;
  }

  loadQueue() {
    try {
      const saved = localStorage.getItem('sync-queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('sync-queue', JSON.stringify(this.queue));
    } catch (error) {
      // Silent save error
    }
  }

  add(operation) {
    this.queue.push({
      ...operation,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      retries: 0,
    });
    this.saveQueue();
  }

  async processQueue() {
    if (this.isSyncing || this.queue.length === 0) return;

    this.isSyncing = true;

    const operations = [...this.queue];
    
    // eslint-disable-next-line no-restricted-syntax
    for (const operation of operations) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await this.executeOperation(operation);
        this.queue.shift();
        this.saveQueue();
      } catch (error) {
        operation.retries += 1;
        
        if (operation.retries >= 3) {
          this.queue.shift();
        }
        
        this.saveQueue();
        break;
      }
    }

    this.isSyncing = false;
  }

  async executeOperation(operation) {
    const { type, data } = operation;

    switch (type) {
      case 'create':
        return NotesAPI.createNote(data);
      case 'update':
        return NotesAPI.updateNote(data.id, data);
      case 'delete':
        return NotesAPI.deleteNote(data.id);
      case 'archive':
        return NotesAPI.archiveNote(data.id);
      case 'unarchive':
        return NotesAPI.unarchiveNote(data.id);
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  getQueue() {
    return this.queue;
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export default new SyncQueue();
