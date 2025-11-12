import { formatRelativeTime } from '../utils.js';
import { sharedCss, sharedSheet } from './shared-styles.js';
import { noteDetailStyles } from './styles/note-detail-styles.js';

class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._note = null;
    // Apply shared stylesheet if available
    if (sharedSheet && this.shadowRoot.adoptedStyleSheets !== undefined) {
      this.shadowRoot.adoptedStyleSheets = [sharedSheet];
    } else {
      const s = document.createElement('style');
      s.textContent = sharedCss;
      this.shadowRoot.appendChild(s);
    }
  }

  set note(value) {
    this._note = value;
    this.render();
  }

  get note() {
    return this._note;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this._note) {
      this.shadowRoot.innerHTML = `
        <style>
          ${noteDetailStyles}
        </style>
        <div class="loading">Loading note details...</div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        ${noteDetailStyles}
      </style>

      <div class="container">
        <div class="header">
          <button class="back-button" id="backButton" aria-label="Back to notes list">
            <i class="fas fa-arrow-left"></i>
            Back to Notes
          </button>
        </div>

        <div class="note-content">
          <h1 class="note-title">${this._escapeHtml(this._note.title)}</h1>
          
          <div class="note-meta">
            <div class="meta-item">
              <i class="fas fa-calendar"></i>
              Created: ${this._formatDate(this._note.createdAt)}
            </div>
            <div class="meta-item">
              <i class="fas fa-clock"></i>
              ${formatRelativeTime(this._note.createdAt)}
            </div>
            ${this._note.lastModified && this._note.lastModified !== this._note.createdAt
    ? `<div class="meta-item" style="color: var(--accent); font-weight: 600;">
                  <i class="fas fa-edit"></i>
                  Last edited: ${formatRelativeTime(this._note.lastModified)}
                </div>`
    : ''
}
            <div class="meta-item">
              <i class="fas fa-id-badge"></i>
              ID: ${this._note.id}
            </div>
            <div>
              <span class="status-badge ${this._note.archived ? 'archived' : 'active'}">
                <i class="fas ${this._note.archived ? 'fa-archive' : 'fa-check-circle'}"></i>
                ${this._note.archived ? 'Archived' : 'Active'}
              </span>
            </div>
          </div>

          <div class="note-body">${this._escapeHtml(this._note.body)}</div>

          <div class="actions">
            <button class="action-button edit-button" id="editButton">
              <i class="fas fa-edit"></i>
              Edit Note
            </button>
            ${this._note.archived
    ? '<button class="action-button unarchive-button" id="unarchiveButton"><i class="fas fa-box-open"></i>Unarchive Note</button>'
    : '<button class="action-button archive-button" id="archiveButton"><i class="fas fa-archive"></i>Archive Note</button>'
}
            <button class="action-button delete-button" id="deleteButton">
              <i class="fas fa-trash"></i>
              Delete Note
            </button>
          </div>
        </div>
      </div>
    `;

    this._attachEventListeners();
  }

  _attachEventListeners() {
    const backButton = this.shadowRoot.getElementById('backButton');
    const editButton = this.shadowRoot.getElementById('editButton');
    const archiveButton = this.shadowRoot.getElementById('archiveButton');
    const unarchiveButton = this.shadowRoot.getElementById('unarchiveButton');
    const deleteButton = this.shadowRoot.getElementById('deleteButton');

    if (backButton) {
      backButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('back', {
          bubbles: true,
          composed: true,
        }));
      });
    }

    if (editButton) {
      editButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('edit', {
          detail: { noteId: this._note.id },
          bubbles: true,
          composed: true,
        }));
      });
    }

    if (archiveButton) {
      archiveButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('archive', {
          detail: { noteId: this._note.id },
          bubbles: true,
          composed: true,
        }));
      });
    }

    if (unarchiveButton) {
      unarchiveButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('unarchive', {
          detail: { noteId: this._note.id },
          bubbles: true,
          composed: true,
        }));
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete', {
          detail: { noteId: this._note.id },
          bubbles: true,
          composed: true,
        }));
      });
    }
  }

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  _formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('id-ID', options);
  }
}

customElements.define('note-detail', NoteDetail);
