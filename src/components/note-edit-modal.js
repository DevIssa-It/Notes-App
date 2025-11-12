import { sharedCss, sharedSheet } from './shared-styles.js';
import { noteEditModalStyles } from './styles/note-edit-modal-styles.js';
import { debounce } from '../performance.js';
import { createFocusTrap, announceToScreenReader } from '../accessibility.js';

class NoteEditModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._note = null;
    this._focusTrap = null;

    // Apply shared stylesheet to provide common utilities (buttons, inputs)
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
    this.shadowRoot.innerHTML = `
      <style>
        ${noteEditModalStyles}
      </style>

      <div class="backdrop"></div>
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-modal="true">
        <div class="modal-header">
          <h2 class="modal-title" id="modalTitle">
            <i class="fas fa-edit"></i>
            Edit Note
          </h2>
          <button class="close-button" id="closeButton" aria-label="Close modal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form id="editForm">
          <div class="form-group">
            <label for="titleInput">Title *</label>
            <input
              type="text"
              id="titleInput"
              name="title"
              placeholder="Enter note title..."
              required
              aria-required="true"
            />
          </div>

          <div class="form-group">
            <label for="bodyInput">Body</label>
            <textarea
              id="bodyInput"
              name="body"
              placeholder="Enter note content..."
              maxlength="1000"
            ></textarea>
            <div class="char-count" id="charCount">0 / 1000</div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" id="cancelButton">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" class="btn-save" id="saveButton">
              <i class="fas fa-save"></i>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;

    this._attachEventListeners();
    this._populateForm();
  }

  _attachEventListeners() {
    const form = this.shadowRoot.getElementById('editForm');
    const closeButton = this.shadowRoot.getElementById('closeButton');
    const cancelButton = this.shadowRoot.getElementById('cancelButton');
    const backdrop = this.shadowRoot.querySelector('.backdrop');
    const bodyInput = this.shadowRoot.getElementById('bodyInput');
    const charCount = this.shadowRoot.getElementById('charCount');
    const saveButton = this.shadowRoot.getElementById('saveButton');
    const titleInput = this.shadowRoot.getElementById('titleInput');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._handleSubmit();
      });
    }

    if (closeButton) {
      closeButton.addEventListener('click', () => this.close());
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    if (bodyInput && charCount) {
      const updateCharCount = debounce(() => {
        const { value } = bodyInput;
        const { length } = value;
        charCount.textContent = `${length} / 1000`;

        charCount.classList.remove('warning', 'error');
        if (length > 900) {
          charCount.classList.add('error');
        } else if (length > 800) {
          charCount.classList.add('warning');
        }
      }, 100);
      
      bodyInput.addEventListener('input', updateCharCount);
    }

    // Validation
    if (titleInput && saveButton) {
      titleInput.addEventListener('input', () => {
        saveButton.disabled = titleInput.value.trim() === '';
      });
    }

    // ESC key to close
    this._handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this._handleKeyDown);
  }

  _populateForm() {
    if (!this._note) return;

    const titleInput = this.shadowRoot.getElementById('titleInput');
    const bodyInput = this.shadowRoot.getElementById('bodyInput');
    const charCount = this.shadowRoot.getElementById('charCount');

    if (titleInput) {
      titleInput.value = this._note.title || '';
    }

    if (bodyInput) {
      bodyInput.value = this._note.body || '';
      const { value } = bodyInput;
      const { length } = value;
      if (charCount) {
        charCount.textContent = `${length} / 1000`;
      }
    }
  }

  _handleSubmit() {
    const titleInput = this.shadowRoot.getElementById('titleInput');
    const bodyInput = this.shadowRoot.getElementById('bodyInput');

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!title) {
      titleInput.focus();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('save', {
        detail: {
          id: this._note.id,
          title,
          body,
          archived: this._note.archived,
        },
        bubbles: true,
        composed: true,
      })
    );

    this.close();
  }

  open() {
    this.setAttribute('open', '');
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-labelledby', 'modal-title');
    
    // Create focus trap
    const modal = this.shadowRoot.querySelector('.modal');
    if (modal) {
      this._focusTrap = createFocusTrap(modal);
      this._focusTrap.enable();
    }
    
    // Focus on title input
    setTimeout(() => {
      const titleInput = this.shadowRoot.getElementById('titleInput');
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 100);
    
    // Announce to screen readers
    announceToScreenReader('Edit note dialog opened');
  }

  close() {
    this.removeAttribute('open');
    this.removeAttribute('role');
    this.removeAttribute('aria-modal');
    this.removeAttribute('aria-labelledby');
    
    // Disable focus trap
    if (this._focusTrap) {
      this._focusTrap.disable();
      this._focusTrap = null;
    }
    
    // Announce to screen readers
    announceToScreenReader('Dialog closed');
  }

  disconnectedCallback() {
    if (this._handleKeyDown) {
      document.removeEventListener('keydown', this._handleKeyDown);
    }
  }
}

customElements.define('note-edit-modal', NoteEditModal);
