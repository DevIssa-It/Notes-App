/**
 * Auto-save Manager
 * Automatically save notes while typing
 */

class AutoSaveManager {
  constructor() {
    this.enabled = true;
    this.interval = 3000; // 3 seconds
    this.timers = new Map();
    this.callbacks = new Map();
  }

  register(noteId, callback) {
    this.callbacks.set(noteId, callback);
  }

  unregister(noteId) {
    this.stop(noteId);
    this.callbacks.delete(noteId);
  }

  trigger(noteId) {
    if (!this.enabled) return;

    this.clearTimer(noteId);

    const timer = setTimeout(() => {
      const callback = this.callbacks.get(noteId);
      if (callback) {
        callback();
        this.dispatchEvent(noteId);
      }
    }, this.interval);

    this.timers.set(noteId, timer);
  }

  clearTimer(noteId) {
    const timer = this.timers.get(noteId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(noteId);
    }
  }

  stop(noteId) {
    this.clearTimer(noteId);
  }

  stopAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.stopAll();
  }

  setInterval(milliseconds) {
    this.interval = milliseconds;
  }

  dispatchEvent(noteId) {
    document.dispatchEvent(new CustomEvent('auto-saved', {
      detail: { noteId, timestamp: new Date().toISOString() },
    }));
  }

  getStatus() {
    return {
      enabled: this.enabled,
      interval: this.interval,
      activeNotes: Array.from(this.timers.keys()),
    };
  }
}

export default new AutoSaveManager();
