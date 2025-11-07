const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      transition: all 300ms ease;
    }

    /* Use CSS variables from parent document */

    * {
      box-sizing: border-box;
    }
    .note-form{
      display:grid;
      gap:16px;
      padding:24px;
      border-radius:18px;
      background: var(--card-gradient);
      border:2px solid var(--card-border);
      box-shadow: var(--shadow-md);
      width:100%;
      max-width:100%;
    }
    input[type="text"], textarea{
      width:100%;
      max-width:100%;
      background: var(--input-bg);
      border:2px solid var(--input-border);
      color: var(--text-primary);
      padding:14px 16px;
      border-radius:14px;
      resize:vertical;
      font-family:inherit;
      font-size:0.95rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
      box-sizing:border-box;
    }
    input[type="text"]:focus, textarea:focus{
      outline:none;
      border-color: var(--input-border-focus);
      background: var(--input-bg-focus);
      box-shadow:0 0 0 4px rgba(124,58,237,0.2), var(--shadow-sm);
      transform:translateY(-1px);
    }
    input[type="text"]:hover, textarea:hover{
      border-color:rgba(124,58,237,0.4);
    }
    input[type="text"]::placeholder, textarea::placeholder{
      color: var(--text-secondary);
      opacity: 0.6;
    }
    textarea{
      min-height:110px;
      max-width:100%;
    }
    label{
      font-size:0.85rem;
      color: var(--text-secondary);
      font-weight:500;
      display:block;
    }
    .row{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
      align-items:center;
      width:100%;
    }
    .right{
      display:flex;
      gap:8px;
      align-items:center;
      margin-left:auto;
      flex-wrap:wrap;
    }
    .form-help{
      font-size:0.82rem;
      color: var(--text-secondary);
      font-style:italic;
      flex:1;
      min-width:150px;
    }
    .btn{
      background: var(--input-bg);
      border:2px solid var(--card-border);
      color: var(--text-primary);
      padding:9px 16px;
      border-radius:12px;
      cursor:pointer;
      font-size:0.88rem;
      font-weight:600;
      transition:all 220ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
      position:relative;
      overflow:hidden;
      white-space:nowrap;
    }
    .btn::before{
      content:'';
      position:absolute;
      top:0;
      left:-100%;
      width:100%;
      height:100%;
      background:linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition:left 400ms ease;
    }
    .btn:hover::before{
      left:100%;
    }
    .btn:hover{
      background: var(--input-bg-focus);
      border-color:rgba(124,58,237,0.7);
      transform:translateY(-2px);
      box-shadow:0 6px 16px rgba(124,58,237,0.3), var(--shadow-sm);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow: var(--shadow-sm);
    }
    .btn.primary{
      background:linear-gradient(135deg,#7c3aed,#06b6d4);
      border:2px solid transparent;
      color:white;
      box-shadow:0 4px 12px rgba(124,58,237,0.4), 0 2px 6px rgba(6,182,212,0.3);
      font-weight:700;
      letter-spacing:0.02em;
    }
    .btn.primary:hover{
      background:linear-gradient(135deg,#8b5cf6,#0891b2);
      box-shadow:0 8px 20px rgba(124,58,237,0.5), 0 4px 10px rgba(6,182,212,0.4);
      transform:translateY(-3px) scale(1.02);
      border-color:rgba(255,255,255,0.2);
    }
    .btn:disabled{
      opacity:0.5;
      cursor:not-allowed;
      transform:none;
    }
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
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onInput = this.onInput.bind(this);
  }

  connectedCallback() {
    // Get elements after component is connected to DOM
    this.form = this.shadowRoot.querySelector('.note-form');
    this.titleInput = this.shadowRoot.querySelector('input[name="title"]');
    this.bodyInput = this.shadowRoot.querySelector('textarea[name="body"]');
    this.submitBtn = this.shadowRoot.getElementById('submitBtn');
    this.resetBtn = this.shadowRoot.getElementById('resetBtn');

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
  }

  updateButtonState() {
    const titleOK = this.titleInput.value.trim().length > 0;
    const bodyOK = this.bodyInput.value.length <= 1000;
    this.submitBtn.disabled = !(titleOK && bodyOK);
  }

  onReset(e) {
    e.preventDefault();
    this.form.reset();
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
    this.updateButtonState();
  }
}

customElements.define('note-input', NoteInput);
export default NoteInput;
