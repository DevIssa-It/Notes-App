import { appBarStyles } from './styles/app-bar-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${appBarStyles}
  </style>
  <div class="appbar">
    <div class="brand">
      <div class="logo">N</div>
      <div class="app-title">Notes App</div>
    </div>
    <div class="actions">
      <theme-toggle></theme-toggle>
      <div class="export-dropdown">
        <button class="btn exportBtn" title="Export notes">
          <i class="fas fa-download"></i> Export <i class="fas fa-caret-down"></i>
        </button>
        <div class="dropdown-menu">
          <div class="dropdown-item" data-format="json">
            <i class="fas fa-file-code"></i> Export as JSON
          </div>
          <div class="dropdown-item" data-format="txt">
            <i class="fas fa-file-alt"></i> Export as TXT
          </div>
          <div class="dropdown-item" data-format="markdown">
            <i class="fas fa-file-lines"></i> Export as Markdown
          </div>
        </div>
      </div>
      <button class="btn importBtn" title="Import notes (JSON)">
        <i class="fas fa-upload"></i> Import
      </button>
      <input type="file" accept="application/json" id="fileInput" style="display:none" />
      <div class="meta">Simple notes - built with Web Components</div>
    </div>
  </div>
`;

class AppBar extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.exportBtn = shadow.querySelector('.exportBtn');
    this.exportDropdown = shadow.querySelector('.export-dropdown');
    this.dropdownMenu = shadow.querySelector('.dropdown-menu');
    this.importBtn = shadow.querySelector('.importBtn');
    this.fileInput = shadow.getElementById('fileInput');
    this.onExportToggle = this.onExportToggle.bind(this);
    this.onExportFormat = this.onExportFormat.bind(this);
    this.onImportClick = this.onImportClick.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
  }

  connectedCallback() {
    this.exportBtn.addEventListener('click', this.onExportToggle);
    this.importBtn.addEventListener('click', this.onImportClick);
    this.fileInput.addEventListener('change', this.onFileChange);
    
    // Add click listeners to dropdown items
    const dropdownItems = this.shadowRoot.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', this.onExportFormat);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.onDocumentClick);
  }

  disconnectedCallback() {
    this.exportBtn.removeEventListener('click', this.onExportToggle);
    this.importBtn.removeEventListener('click', this.onImportClick);
    this.fileInput.removeEventListener('change', this.onFileChange);
    document.removeEventListener('click', this.onDocumentClick);
    
    const dropdownItems = this.shadowRoot.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.removeEventListener('click', this.onExportFormat);
    });
  }

  onExportToggle(e) {
    e.stopPropagation();
    this.dropdownMenu.classList.toggle('show');
  }

  onExportFormat(e) {
    const { format } = e.currentTarget.dataset;
    this.dropdownMenu.classList.remove('show');
    
    this.dispatchEvent(
      new CustomEvent('export-notes', { 
        detail: { format },
        bubbles: true, 
        composed: true 
      })
    );
  }

  onDocumentClick() {
    this.dropdownMenu.classList.remove('show');
  }

  onImportClick() {
    this.fileInput.value = null;
    this.fileInput.click();
  }

  onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        this.dispatchEvent(
          new CustomEvent('import-notes', {
            detail: { data },
            bubbles: true,
            composed: true,
          })
        );
      } catch (err) {
        this.dispatchEvent(
          new CustomEvent('import-error', {
            detail: { error: err.message },
            bubbles: true,
            composed: true,
          })
        );
      }
    };
    reader.readAsText(file);
  }
}

customElements.define('app-bar', AppBar);
export default AppBar;
