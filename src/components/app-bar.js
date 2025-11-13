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
      <button class="btn exportBtn" title="Export notes as JSON">
        <i class="fas fa-download"></i> Export
      </button>
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
    this.importBtn = shadow.querySelector('.importBtn');
    this.fileInput = shadow.getElementById('fileInput');
    this.onExport = this.onExport.bind(this);
    this.onImportClick = this.onImportClick.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  connectedCallback() {
    this.exportBtn.addEventListener('click', this.onExport);
    this.importBtn.addEventListener('click', this.onImportClick);
    this.fileInput.addEventListener('change', this.onFileChange);
  }

  disconnectedCallback() {
    this.exportBtn.removeEventListener('click', this.onExport);
    this.importBtn.removeEventListener('click', this.onImportClick);
    this.fileInput.removeEventListener('change', this.onFileChange);
  }

  onExport() {
    this.dispatchEvent(
      new CustomEvent('export-notes', { bubbles: true, composed: true })
    );
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
