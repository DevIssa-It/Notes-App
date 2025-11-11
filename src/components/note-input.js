import { sharedCss, sharedSheet } from './shared-styles.js';
import { noteInputStyles } from './styles/note-input-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${noteInputStyles}
  </style>
  <form class="note-form" novalidate>
    <label for="titleInput">Title</label>
    <input id="titleInput" type="text" name="title" placeholder="Note title" required aria-required="true" />
    <label for="bodyInput">Body</label>
    <textarea id="bodyInput" name="body" placeholder="Write your note here..." required aria-required="true"></textarea>
    <div class="row">
      <div class="form-help">Max body length: 1000. Title is required.</div>
      <div class="right">
        <button class="btn" type="button" id="resetBtn">
          <i class="fas fa-redo"></i> Reset
        </button>
        <button class="btn primary" type="submit" id="submitBtn">
          <i class="fas fa-plus"></i> Add Note
        </button>
      </div>
    </div>
  </form>
`;

class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Apply shared stylesheet when possible to reuse common utilities
    if (sharedSheet && this.shadowRoot.adoptedStyleSheets !== undefined) {
      this.shadowRoot.adoptedStyleSheets = [sharedSheet];
    } else {
      const s = document.createElement('style');
      s.textContent = sharedCss;
      this.shadowRoot.appendChild(s);
    }

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onInput = this.onInput.bind(this);
    
    // Auto-save timeout
    this.autoSaveTimeout = null;
  }

  connectedCallback() {
    // Get elements after component is connected to DOM
    this.form = this.shadowRoot.querySelector('.note-form');
    this.titleInput = this.shadowRoot.querySelector('input[name="title"]');
    this.bodyInput = this.shadowRoot.querySelector('textarea[name="body"]');
    this.submitBtn = this.shadowRoot.getElementById('submitBtn');
    this.resetBtn = this.shadowRoot.getElementById('resetBtn');

    // Load draft from localStorage
    this.loadDraft();

    // Add event listeners
    if (this.form) this.form.addEventListener('submit', this.onSubmit);
    if (this.resetBtn) this.resetBtn.addEventListener('click', this.onReset);
    if (this.titleInput)
      this.titleInput.addEventListener('input', this.onInput);
    if (this.bodyInput) this.bodyInput.addEventListener('input', this.onInput);

    this.updateButtonState();
  }

  disconnectedCallback() {
    if (this.form) this.form.removeEventListener('submit', this.onSubmit);
    if (this.resetBtn) this.resetBtn.removeEventListener('click', this.onReset);
    if (this.titleInput)
      this.titleInput.removeEventListener('input', this.onInput);
    if (this.bodyInput)
      this.bodyInput.removeEventListener('input', this.onInput);
  }

  onInput() {
    // Realtime validation: title required, body max length 1000
    const titleOK = this.titleInput.value.trim().length > 0;
    const bodyOK = this.bodyInput.value.length <= 1000;
    if (!titleOK) {
      this.titleInput.style.outline = '1px solid #ff7b7b';
    } else {
      this.titleInput.style.outline = 'none';
    }
    if (!bodyOK) {
      this.bodyInput.style.outline = '1px solid #ff7b7b';
    } else {
      this.bodyInput.style.outline = 'none';
    }
    this.updateButtonState();
    
    // Auto-save draft after 1 second of inactivity
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft();
    }, 1000);
  }

  updateButtonState() {
    const titleOK = this.titleInput.value.trim().length > 0;
    const bodyOK = this.bodyInput.value.length <= 1000;
    this.submitBtn.disabled = !(titleOK && bodyOK);
  }

  onReset(e) {
    e.preventDefault();
    this.form.reset();
    this.clearDraft();
    this.updateButtonState();
  }

  onSubmit(e) {
    e.preventDefault();
    const note = {
      id: `notes-${Math.random().toString(36).slice(2, 9)}`,
      title: this.titleInput.value.trim(),
      body: this.bodyInput.value.trim(),
      createdAt: new Date().toISOString(),
      archived: false,
    };
    // Dispatch event to parent app
    this.dispatchEvent(
      new CustomEvent('note-added', {
        detail: note,
        bubbles: true,
        composed: true,
      })
    );
    this.form.reset();
    this.clearDraft(); // Clear draft after successful submission
    this.updateButtonState();
  }

  /**
   * Save draft to localStorage
   */
  saveDraft() {
    const title = this.titleInput.value.trim();
    const body = this.bodyInput.value.trim();
    
    // Only save if there's content
    if (title || body) {
      try {
        localStorage.setItem('noteDraft', JSON.stringify({ title, body }));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    } else {
      this.clearDraft();
    }
  }

  /**
   * Load draft from localStorage
   */
  loadDraft() {
    try {
      const draft = localStorage.getItem('noteDraft');
      if (draft) {
        const { title, body } = JSON.parse(draft);
        if (title || body) {
          this.titleInput.value = title || '';
          this.bodyInput.value = body || '';
          this.updateButtonState();
          
          // Draft restored successfully
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft() {
    try {
      localStorage.removeItem('noteDraft');
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  /**
   * Check if there are unsaved changes
   */
  hasUnsavedChanges() {
    const title = this.titleInput.value.trim();
    const body = this.bodyInput.value.trim();
    return !!(title || body);
  }
}

customElements.define('note-input', NoteInput);
export default NoteInput;
