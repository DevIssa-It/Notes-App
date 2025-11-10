/**
 * Keyboard Shortcuts Modal Component
 * Shows available keyboard shortcuts for the app
 */

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
        :host {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10000;
          align-items: center;
          justify-content: center;
        }

        :host([open]) {
          display: flex;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }

        .modal {
          position: relative;
          background: linear-gradient(145deg, #1e293b, #0f172a);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e6eef8;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }

        .close-btn {
          background: rgba(148, 163, 184, 0.1);
          border: none;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          cursor: pointer;
          color: #94a3b8;
          font-size: 20px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          transform: rotate(90deg);
        }

        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .shortcut-item:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateX(4px);
        }

        .shortcut-desc {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #e6eef8;
          font-size: 14px;
        }

        .shortcut-icon {
          font-size: 20px;
          width: 32px;
          text-align: center;
        }

        .keys {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .key {
          background: linear-gradient(145deg, #2d3748, #1a202c);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 6px;
          padding: 6px 12px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .plus {
          color: #64748b;
          font-size: 12px;
        }

        .section-title {
          color: #7c3aed;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 16px 0 8px 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .modal {
            padding: 24px;
            width: 95%;
          }

          .title {
            font-size: 20px;
          }

          .shortcut-item {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }
        }
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
