const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      margin-bottom: 24px;
      transition: all 300ms ease;
    }

    /* Use CSS variables from parent document */
    /* Use CSS variables from parent document */

    .search-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    .search-input {
      width: 100%;
      padding: 14px 50px 14px 20px;
      background: var(--card-gradient);
      border: 2px solid var(--card-border);
      border-radius: 16px;
      color: var(--text-primary);
      font-size: 1rem;
      font-family: inherit;
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-md);
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--input-border-focus);
      background: var(--input-bg-focus);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3), 0 0 0 4px rgba(124, 58, 237, 0.1);
    }

    .search-input::placeholder {
      color: var(--text-secondary);
    }

    .search-icon {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
      pointer-events: none;
      transition: color 250ms ease;
    }

    .search-input:focus ~ .search-icon {
      color: #7c3aed;
    }

    .clear-btn {
      position: absolute;
      right: 50px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 200ms ease;
      opacity: 0;
      visibility: hidden;
    }

    .clear-btn.visible {
      opacity: 1;
      visibility: visible;
    }

    .clear-btn:hover {
      background: rgba(124, 58, 237, 0.2);
      color: var(--text-primary);
    }

    .search-result {
      text-align: center;
      margin-top: 12px;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .search-result.active {
      color: #7c3aed;
      font-weight: 600;
    }
  </style>
  <div class="search-container">
    <input 
      type="search" 
      class="search-input" 
      placeholder="Search notes by title or content..."
      aria-label="Search notes"
      autocomplete="off"
    />
    <button class="clear-btn" aria-label="Clear search" title="Clear search">×</button>
    <span class="search-icon" aria-hidden="true">🔍</span>
  </div>
  <div class="search-result"></div>
`;

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.input = this.shadowRoot.querySelector('.search-input');
    this.clearBtn = this.shadowRoot.querySelector('.clear-btn');
    this.resultEl = this.shadowRoot.querySelector('.search-result');

    this.onInput = this.onInput.bind(this);
    this.onClear = this.onClear.bind(this);
  }

  connectedCallback() {
    this.input.addEventListener('input', this.onInput);
    this.clearBtn.addEventListener('click', this.onClear);

    // Add keyboard shortcut: Ctrl+K or Cmd+K to focus search
    document.addEventListener('keydown', this.onGlobalKeydown.bind(this));
  }

  disconnectedCallback() {
    this.input.removeEventListener('input', this.onInput);
    this.clearBtn.removeEventListener('click', this.onClear);
  }

  onGlobalKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.input.focus();
    }
  }

  onInput(e) {
    const query = e.target.value.trim();

    // Show/hide clear button
    if (query) {
      this.clearBtn.classList.add('visible');
    } else {
      this.clearBtn.classList.remove('visible');
    }

    // Emit search event
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { query },
        bubbles: true,
        composed: true,
      })
    );
  }

  onClear() {
    this.input.value = '';
    this.clearBtn.classList.remove('visible');
    this.resultEl.textContent = '';
    this.resultEl.classList.remove('active');

    // Emit search event with empty query
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { query: '' },
        bubbles: true,
        composed: true,
      })
    );

    this.input.focus();
  }

  updateResult(count, total) {
    if (this.input.value.trim()) {
      this.resultEl.textContent = `Found ${count} of ${total} notes`;
      this.resultEl.classList.add('active');
    } else {
      this.resultEl.textContent = '';
      this.resultEl.classList.remove('active');
    }
  }

  get value() {
    return this.input.value;
  }

  set value(val) {
    this.input.value = val;
    this.onInput({ target: this.input });
  }
}

customElements.define('search-bar', SearchBar);
export default SearchBar;
