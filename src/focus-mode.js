/**
 * Focus Mode Manager
 * Distraction-free writing mode
 */

class FocusModeManager {
  constructor() {
    this.isActive = false;
    this.settings = {
      hideToolbar: true,
      hideNoteList: true,
      dimBackground: true,
      zenMode: false,
      typewriterMode: false,
    };
  }

  activate(customSettings = {}) {
    this.settings = { ...this.settings, ...customSettings };
    this.isActive = true;
    this.applyStyles();
    this.dispatchEvent('focus-mode-activated');
  }

  deactivate() {
    this.isActive = false;
    this.removeStyles();
    this.dispatchEvent('focus-mode-deactivated');
  }

  toggle() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  applyStyles() {
    document.body.classList.add('focus-mode');
    
    if (this.settings.hideToolbar) {
      document.body.classList.add('hide-toolbar');
    }
    
    if (this.settings.hideNoteList) {
      document.body.classList.add('hide-note-list');
    }
    
    if (this.settings.dimBackground) {
      document.body.classList.add('dim-background');
    }
    
    if (this.settings.zenMode) {
      document.body.classList.add('zen-mode');
    }
  }

  removeStyles() {
    document.body.classList.remove(
      'focus-mode',
      'hide-toolbar',
      'hide-note-list',
      'dim-background',
      'zen-mode'
    );
  }

  dispatchEvent(eventName) {
    document.dispatchEvent(new CustomEvent(eventName, {
      detail: { settings: this.settings },
    }));
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.isActive) {
      this.removeStyles();
      this.applyStyles();
    }
  }

  getSettings() {
    return { ...this.settings };
  }

  getStatus() {
    return {
      isActive: this.isActive,
      settings: this.settings,
    };
  }
}

export default new FocusModeManager();
