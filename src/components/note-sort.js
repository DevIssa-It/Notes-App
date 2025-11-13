/**
 * Note Sort Component
 * Allows users to sort notes by different criteria
 */

class NoteSort extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._loadSortPreference();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .sort-container {
          position: relative;
          display: inline-block;
        }

        .sort-button {
          background: var(--card-gradient, linear-gradient(145deg, #1e293b, rgba(30, 41, 59, 0.8)));
          border: 2px solid var(--card-border, #334155);
          color: var(--text-primary, #e6eef8);
          padding: 10px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .sort-button:hover {
          background: rgba(51, 65, 85, 1);
          border-color: #7c3aed;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .sort-button i {
          font-size: 0.9rem;
        }

        .dropdown {
          display: none;
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--card-gradient, linear-gradient(145deg, #1e293b, rgba(30, 41, 59, 0.8)));
          border: 2px solid var(--card-border, #334155);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .dropdown.show {
          display: block;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sort-option {
          padding: 12px 16px;
          color: var(--text-primary, #e6eef8);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
        }

        .sort-option:hover {
          background: rgba(124, 58, 237, 0.2);
          padding-left: 20px;
        }

        .sort-option.active {
          background: rgba(124, 58, 237, 0.3);
          border-left: 3px solid #7c3aed;
        }

        .sort-option i {
          width: 16px;
          text-align: center;
          opacity: 0.8;
        }

        .sort-option .check {
          margin-left: auto;
          color: #10b981;
          opacity: 0;
        }

        .sort-option.active .check {
          opacity: 1;
        }

        :host-context([data-theme='light']) .sort-button,
        :host-context([data-theme='light']) .dropdown {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
        }

        :host-context([data-theme='light']) .sort-button:hover {
          background: #f1f5f9;
        }

        :host-context([data-theme='light']) .sort-option {
          color: #0f172a;
        }
      </style>

      <div class="sort-container">
        <button class="sort-button" id="sortButton">
          <i class="fas fa-sort"></i>
          <span id="sortLabel">Sort</span>
          <i class="fas fa-caret-down"></i>
        </button>
        
        <div class="dropdown" id="dropdown">
          <div class="sort-option" data-sort="newest">
            <i class="fas fa-calendar-plus"></i>
            <span>Newest First</span>
            <i class="fas fa-check check"></i>
          </div>
          <div class="sort-option" data-sort="oldest">
            <i class="fas fa-calendar-minus"></i>
            <span>Oldest First</span>
            <i class="fas fa-check check"></i>
          </div>
          <div class="sort-option" data-sort="title-asc">
            <i class="fas fa-sort-alpha-down"></i>
            <span>Title A-Z</span>
            <i class="fas fa-check check"></i>
          </div>
          <div class="sort-option" data-sort="title-desc">
            <i class="fas fa-sort-alpha-up"></i>
            <span>Title Z-A</span>
            <i class="fas fa-check check"></i>
          </div>
        </div>
      </div>
    `;

    this._attachEventListeners();
  }

  _attachEventListeners() {
    const sortButton = this.shadowRoot.getElementById('sortButton');
    const dropdown = this.shadowRoot.getElementById('dropdown');
    const options = this.shadowRoot.querySelectorAll('.sort-option');

    sortButton.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        const sortType = option.dataset.sort;
        this._applySortOption(sortType);
        dropdown.classList.remove('show');
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });
  }

  _applySortOption(sortType) {
    // Update active state
    const options = this.shadowRoot.querySelectorAll('.sort-option');
    options.forEach((opt) => {
      opt.classList.remove('active');
      if (opt.dataset.sort === sortType) {
        opt.classList.add('active');
      }
    });

    // Update button label
    const label = this.shadowRoot.getElementById('sortLabel');
    const labels = {
      'newest': 'Newest',
      'oldest': 'Oldest',
      'title-asc': 'A-Z',
      'title-desc': 'Z-A',
    };
    label.textContent = labels[sortType] || 'Sort';

    // Save preference
    localStorage.setItem('notes-sort', sortType);

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent('sort-changed', {
        detail: { sortType },
        bubbles: true,
        composed: true,
      })
    );
  }

  _loadSortPreference() {
    const savedSort = localStorage.getItem('notes-sort') || 'newest';
    this._applySortOption(savedSort);
  }
}

customElements.define('note-sort', NoteSort);
