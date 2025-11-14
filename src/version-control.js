/**
 * Version Control
 * Track note version history
 */

class VersionControl {
  constructor() {
    this.versions = new Map();
    this.maxVersions = 20;
  }

  createVersion(noteId, noteData, changeDescription = '') {
    if (!this.versions.has(noteId)) {
      this.versions.set(noteId, []);
    }

    const versions = this.versions.get(noteId);
    const version = {
      id: this.generateVersionId(),
      number: versions.length + 1,
      noteData: JSON.parse(JSON.stringify(noteData)),
      changeDescription,
      timestamp: new Date().toISOString(),
    };

    versions.push(version);

    if (versions.length > this.maxVersions) {
      versions.shift();
    }

    return version;
  }

  getVersions(noteId) {
    return this.versions.get(noteId) || [];
  }

  getVersion(noteId, versionNumber) {
    const versions = this.getVersions(noteId);
    return versions.find((v) => v.number === versionNumber);
  }

  restoreVersion(noteId, versionNumber) {
    const version = this.getVersion(noteId, versionNumber);
    return version ? version.noteData : null;
  }

  compareVersions(noteId, version1, version2) {
    const v1 = this.getVersion(noteId, version1);
    const v2 = this.getVersion(noteId, version2);
    
    if (!v1 || !v2) return null;

    return {
      titleChanged: v1.noteData.title !== v2.noteData.title,
      bodyChanged: v1.noteData.body !== v2.noteData.body,
      version1: v1,
      version2: v2,
    };
  }

  generateVersionId() {
    return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  clearVersionHistory(noteId) {
    this.versions.delete(noteId);
  }
}

export default new VersionControl();
