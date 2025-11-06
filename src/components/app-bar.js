const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      --text-primary: #e6eef8;
      --text-secondary: #94a3b8;
      --btn-bg: rgba(30,41,59,0.9);
      --btn-border: #334155;
      --btn-text: #e6eef8;
      --btn-hover-bg: rgba(51,65,85,1);
      --shadow: rgba(0,0,0,0.3);
      transition: all 300ms ease;
    }

    :host-context([data-theme='light']) {
      --text-primary: #0f172a;
      --text-secondary: #64748b;
      --btn-bg: #ffffff;
      --btn-border: #cbd5e1;
      --btn-text: #0f172a;
      --btn-hover-bg: #f1f5f9;
      --shadow: rgba(0,0,0,0.08);
    }

    .appbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:20px 28px;
      color:var(--text-primary);
      flex-wrap:wrap;
      gap:16px;
    }
    .brand{display:flex;align-items:center;gap:12px}
    .logo{
      width:48px;
      height:48px;
      border-radius:12px;
      background:linear-gradient(135deg,#7c3aed,#06b6d4);
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:1.3rem;
      box-shadow:0 4px 12px rgba(124,58,237,0.3);
    }
    .app-title{font-size:1.2rem;font-weight:700;letter-spacing:0.02em;}
    .actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
    .meta{font-size:0.85rem;color:var(--text-secondary);font-style:italic;}
    .btn{
      background:var(--btn-bg);
      border:2px solid var(--btn-border);
      color:var(--btn-text);
      padding:9px 16px;
      border-radius:12px;
      cursor:pointer;
      font-size:0.88rem;
      font-weight:600;
      transition:all 220ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:0 2px 6px var(--shadow);
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
      background:var(--btn-hover-bg);
      border-color:rgba(124,58,237,0.7);
      transform:translateY(-2px);
      box-shadow:0 6px 16px rgba(124,58,237,0.3), 0 2px 6px var(--shadow);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow:0 2px 6px var(--shadow);
    }
    .exportBtn:hover{
      background:#059669;
      border-color:#10b981;
      color:white;
      box-shadow:0 6px 16px rgba(5,150,105,0.4), 0 2px 6px var(--shadow);
    }
    .importBtn:hover{
      background:#0284c7;
      border-color:#0ea5e9;
      color:white;
      box-shadow:0 6px 16px rgba(2,132,199,0.4), 0 2px 6px var(--shadow);
    }
    @media (max-width:720px){
      .appbar{padding:14px 16px;}
      .logo{width:42px;height:42px;font-size:1.1rem;}
      .app-title{font-size:1.05rem;}
      .meta{display:none;}
    }
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
