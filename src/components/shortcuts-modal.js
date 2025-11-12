/**
 * Keyboard Shortcuts Modal Component
 * Shows available keyboard shortcuts for the app
 */

import { shortcutsModalStyles } from './styles/shortcuts-modal-styles.js';

class ShortcutsModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${shortcutsModalStyles}
      </style>

      <div class="overlay"></div>
      <div class="modal">
        <div class="header">
          <h2 class="title">
            <span>⌨️</span>
            <span>Keyboard Shortcuts</span>
          </h2>
          <button class="close-btn" id="closeBtn">×</button>
        </div>

        <div class="shortcuts-list">
          <div class="section-title">Navigation</div>
          
          <div class="shortcut-item">
            <div class="shortcut-desc">
              <span class="shortcut-icon">📋</span>
              <span>Show Keyboard Shortcuts</span>
            </div>
            <div class="keys">
              <span class="key">Ctrl</span>
              <span class="plus">+</span>
              <span class="key">K</span>
            </div>
          </div>

          <div class="shortcut-item">
            <div class="shortcut-desc">
              <span class="shortcut-icon">🔍</span>
              <span>Focus Search</span>
            </div>
            <div class="keys">
              <span class="key">Ctrl</span>
              <span class="plus">+</span>
              <span class="key">F</span>
            </div>
          </div>

          <div class="shortcut-item">
            <div class="shortcut-desc">
              <span class="shortcut-icon">➕</span>
              <span>Focus New Note Input</span>
            </div>
            <div class="keys">
              <span class="key">Ctrl</span>
              <span class="plus">+</span>
              <span class="key">N</span>
            </div>
          </div>

          <div class="section-title">Actions</div>

          <div class="shortcut-item">
            <div class="shortcut-desc">
              <span class="shortcut-icon">🌙</span>
              <span>Toggle Dark/Light Theme</span>
            </div>
            <div class="keys">
              <span class="key">Ctrl</span>
              <span class="plus">+</span>
              <span class="key">T</span>
            </div>
          </div>

          <div class="shortcut-item">
            <div class="shortcut-desc">
              <span class="shortcut-icon">❌</span>
              <span>Close Modal/Dialog</span>
            </div>
            <div class="keys">
              <span class="key">Esc</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addEventListeners() {
    const closeBtn = this.shadowRoot.getElementById('closeBtn');
    const overlay = this.shadowRoot.querySelector('.overlay');

    closeBtn.addEventListener('click', () => this.close());
    overlay.addEventListener('click', () => this.close());

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.hasAttribute('open')) {
        this.close();
      }
    });
  }

  open() {
    this.setAttribute('open', '');
  }

  close() {
    this.removeAttribute('open');
  }
}

customElements.define('shortcuts-modal', ShortcutsModal);
