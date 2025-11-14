/**
 * Clipboard Manager
 * Enhanced copy/paste functionality
 */

class ClipboardManager {
  async copy(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      return this.fallbackCopy(text);
    } catch {
      return this.fallbackCopy(text);
    }
  }

  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }

  async paste() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return await navigator.clipboard.readText();
      }
      return null;
    } catch {
      return null;
    }
  }

  async copyNote(note) {
    const text = `${note.title}\n\n${note.body}`;
    return this.copy(text);
  }

  async copyAsMarkdown(note) {
    const markdown = `# ${note.title}\n\n${note.body}`;
    return this.copy(markdown);
  }

  async copyAsHTML(note) {
    const html = `<h1>${note.title}</h1>\n<p>${note.body}</p>`;
    return this.copy(html);
  }
}

export default new ClipboardManager();
