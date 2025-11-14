/**
 * Collaboration Manager
 * Handle note sharing and collaboration features
 */

class CollaborationManager {
  constructor() {
    this.shares = this.loadShares();
  }

  loadShares() {
    try {
      const saved = localStorage.getItem('note-shares');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveShares() {
    try {
      localStorage.setItem('note-shares', JSON.stringify(this.shares));
    } catch {
      // Silent error
    }
  }

  shareNote(noteId, noteData, options = {}) {
    const share = {
      id: this.generateShareId(),
      noteId,
      shareLink: this.generateShareLink(),
      permissions: options.permissions || 'read',
      expiresAt: options.expiresAt || null,
      password: options.password || null,
      createdAt: new Date().toISOString(),
      accessCount: 0,
      noteData,
    };

    this.shares.push(share);
    this.saveShares();
    return share;
  }

  getShare(shareId) {
    return this.shares.find((s) => s.id === shareId);
  }

  revokeShare(shareId) {
    const index = this.shares.findIndex((s) => s.id === shareId);
    if (index > -1) {
      this.shares.splice(index, 1);
      this.saveShares();
      return true;
    }
    return false;
  }

  generateShareId() {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateShareLink() {
    return `${window.location.origin}/share/${this.generateShareId()}`;
  }

  getSharesByNote(noteId) {
    return this.shares.filter((s) => s.noteId === noteId);
  }
}

export default new CollaborationManager();
