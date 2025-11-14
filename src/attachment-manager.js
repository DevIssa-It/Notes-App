/**
 * Attachment Manager
 * Handle file attachments for notes
 */

class AttachmentManager {
  constructor() {
    this.attachments = new Map();
    this.maxSize = 10 * 1024 * 1024; // 10MB
  }

  async addAttachment(noteId, file) {
    if (file.size > this.maxSize) {
      throw new Error('File too large');
    }

    const attachment = {
      id: this.generateId(),
      noteId,
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: new Date().toISOString(),
    };

    const reader = new FileReader();
    const data = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    attachment.data = data;
    this.attachments.set(attachment.id, attachment);
    return attachment;
  }

  getAttachment(id) {
    return this.attachments.get(id);
  }

  getAttachmentsByNote(noteId) {
    return Array.from(this.attachments.values())
      .filter((a) => a.noteId === noteId);
  }

  removeAttachment(id) {
    return this.attachments.delete(id);
  }

  generateId() {
    return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getTotalSize() {
    return Array.from(this.attachments.values())
      .reduce((sum, att) => sum + att.size, 0);
  }
}

export default new AttachmentManager();
