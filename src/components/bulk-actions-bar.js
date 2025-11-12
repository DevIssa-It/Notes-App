import { bulkActionsBarStyles } from './styles/bulk-actions-bar-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${bulkActionsBarStyles}
  </style>
  
  <div class="bulk-bar">
    <div class="count">
      <i class="fas fa-check-circle"></i>
      <span class="count-text">0 selected</span>
    </div>
    <div class="divider"></div>
    <div class="actions">
      <button class="action-btn archive-btn">
        <i class="fas fa-archive"></i>
        <span>Archive</span>
      </button>
      <button class="action-btn danger delete-btn">
        <i class="fas fa-trash"></i>
        <span>Delete</span>
      </button>
    </div>
    <button class="close-btn">
      <i class="fas fa-times"></i>
    </button>
  </div>
`;

class BulkActionsBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.countText = this.shadowRoot.querySelector('.count-text');
    this.archiveBtn = this.shadowRoot.querySelector('.archive-btn');
    this.deleteBtn = this.shadowRoot.querySelector('.delete-btn');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    
    this.selectedIds = new Set();
  }
  
  connectedCallback() {
    this.archiveBtn.addEventListener('click', () => this.handleArchive());
    this.deleteBtn.addEventListener('click', () => this.handleDelete());
    this.closeBtn.addEventListener('click', () => this.clearSelection());
  }
  
  updateCount(count) {
    this.countText.textContent = `${count} selected`;
    
    if (count > 0) {
      this.setAttribute('visible', '');
    } else {
      this.removeAttribute('visible');
    }
  }
  
  setSelectedIds(ids) {
    this.selectedIds = new Set(ids);
    this.updateCount(ids.length);
  }
  
  clearSelection() {
    this.selectedIds.clear();
    this.updateCount(0);
    this.dispatchEvent(new CustomEvent('clear-selection', {
      bubbles: true,
      composed: true
    }));
  }
  
  handleArchive() {
    this.dispatchEvent(new CustomEvent('bulk-archive', {
      detail: { ids: Array.from(this.selectedIds) },
      bubbles: true,
      composed: true
    }));
  }
  
  handleDelete() {
    this.dispatchEvent(new CustomEvent('bulk-delete', {
      detail: { ids: Array.from(this.selectedIds) },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('bulk-actions-bar', BulkActionsBar);
export default BulkActionsBar;
