import { formatRelativeTime } from '../utils.js';

class NoteDetail extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._note = null;
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
          :host {
            display: block;
            min-height: 100vh;
            background: linear-gradient(180deg, var(--bg), var(--bg-gradient-end));
            color: var(--text-primary);
            padding: 2rem;
          }

          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 50vh;
            font-size: 1.2rem;
            color: var(--text-secondary);
          }
        </style>
        <div class="loading">Loading note details...</div>
      `;
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :host {
          display: block;
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bg), var(--bg-gradient-end));
          color: var(--text-primary);
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--card-border);
        }

        .back-button {
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(124, 58, 237, 0.3);
        }

        .back-button:active {
          transform: translateY(0);
        }

        .note-content {
          background: var(--card-gradient);
          border-radius: 12px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid var(--card-border);
        }

        .note-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .note-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--card-border);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .meta-item i {
          color: #7c3aed;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .status-badge.archived {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          border: 1px solid #fb923c;
        }

        .note-body {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--card-border);
        }

        .action-button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .archive-button {
          background: rgba(251, 146, 60, 0.2);
          color: #fb923c;
          border: 1px solid #fb923c;
        }

        .archive-button:hover {
          background: #fb923c;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(251, 146, 60, 0.3);
        }

        .unarchive-button {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .unarchive-button:hover {
          background: #22c55e;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(34, 197, 94, 0.3);
        }

        .edit-button {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1px solid #3b82f6;
        }

        .edit-button:hover {
          background: #3b82f6;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .delete-button {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .delete-button:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
        }

        .action-button:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .container {
            padding: 1rem;
          }

          .note-title {
            font-size: 1.8rem;
          }

          .note-body {
            font-size: 1rem;
          }

          .actions {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
          }
        }
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
