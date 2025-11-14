/**
 * Keyboard Shortcut Manager
 * Handle custom keyboard shortcuts
 */

class ShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.initDefaultShortcuts();
    this.attachListener();
  }

  initDefaultShortcuts() {
    this.register('ctrl+n', () => this.trigger('new-note'));
    this.register('ctrl+s', () => this.trigger('save-note'));
    this.register('ctrl+f', () => this.trigger('search'));
    this.register('ctrl+d', () => this.trigger('delete-note'));
    this.register('escape', () => this.trigger('close-modal'));
  }

  register(shortcut, callback) {
    const key = this.normalizeShortcut(shortcut);
    this.shortcuts.set(key, callback);
  }

  unregister(shortcut) {
    const key = this.normalizeShortcut(shortcut);
    this.shortcuts.delete(key);
  }

  normalizeShortcut(shortcut) {
    return shortcut.toLowerCase().replace(/\s+/g, '');
  }

  attachListener() {
    document.addEventListener('keydown', (e) => {
      if (!this.enabled) return;

      const key = this.buildKeyString(e);
      const handler = this.shortcuts.get(key);
      
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    });
  }

  buildKeyString(event) {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    if (event.metaKey) parts.push('meta');
    
    const key = event.key.toLowerCase();
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      parts.push(key);
    }
    
    return parts.join('+');
  }

  trigger(eventName) {
    document.dispatchEvent(new CustomEvent(`shortcut:${eventName}`));
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  getShortcuts() {
    return Array.from(this.shortcuts.keys());
  }
}

export default new ShortcutManager();
