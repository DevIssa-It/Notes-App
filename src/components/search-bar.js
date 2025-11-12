import { searchBarStyles } from './styles/search-bar-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${searchBarStyles}
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
    this.searchIcon = this.shadowRoot.querySelector('.search-icon');
    this.resultEl = this.shadowRoot.querySelector('.search-result');

    this.onInput = this.onInput.bind(this);
    this.onClear = this.onClear.bind(this);
    
    // Debounce timeout
    this.searchTimeout = null;
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

    // Show/hide clear button and search icon
    if (query) {
      this.clearBtn.classList.add('visible');
      this.searchIcon.classList.add('hidden');
    } else {
      this.clearBtn.classList.remove('visible');
      this.searchIcon.classList.remove('hidden');
    }

    // Clear existing timeout
    clearTimeout(this.searchTimeout);

    // Debounce search - wait 300ms after user stops typing
    this.searchTimeout = setTimeout(() => {
      // Emit search event
      this.dispatchEvent(
        new CustomEvent('search', {
          detail: { query },
          bubbles: true,
          composed: true,
        })
      );
    }, 300);
  }

  onClear() {
    this.input.value = '';
    this.clearBtn.classList.remove('visible');
    this.searchIcon.classList.remove('hidden');
    this.resultEl.textContent = '';
    this.resultEl.classList.remove('active');

    // Clear pending search timeout
    clearTimeout(this.searchTimeout);

    // Emit search event with empty query immediately (no debounce for clear)
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
