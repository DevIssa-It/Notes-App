const template = document.createElement('template');
template.innerHTML = `
  <style>
    .note-card{
      box-sizing:border-box;
      background:linear-gradient(145deg, #1e293b, rgba(30,41,59,0.8));
      padding:20px;
      border-radius:16px;
      border:2px solid #334155;
      box-shadow:0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3);
      height:280px;
      display:flex;
      flex-direction:column;
      gap:12px;
      transition:transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms ease;
      position:relative;
      overflow:hidden;
      width:100%;
    }
    .note-card::before{
      content:'';
      position:absolute;
      top:0;
      left:0;
      right:0;
      height:4px;
      background:linear-gradient(90deg,#7c3aed,#06b6d4);
      opacity:0;
      transition:opacity 250ms ease;
    }
    .note-card:hover{
      transform:translateY(-4px);
      box-shadow:0 12px 24px rgba(124,58,237,0.25), 0 6px 12px rgba(0,0,0,0.5);
      border-color:rgba(124,58,237,0.6);
    }
    .note-card:hover::before{
      opacity:1;
    }
    .title{
      font-weight:700;
      font-size:1.05rem;
      color:#e6eef8;
      letter-spacing:0.01em;
      word-wrap:break-word;
      overflow-wrap:break-word;
    }
    .body{
      white-space:pre-wrap;
      font-size:0.9rem;
      color:#94a3b8;
      flex:1;
      line-height:1.5;
      word-wrap:break-word;
      overflow-wrap:break-word;
      overflow-y:auto;
      scrollbar-width:thin;
      scrollbar-color:#334155 transparent;
    }
    .body::-webkit-scrollbar{
      width:6px;
    }
    .body::-webkit-scrollbar-track{
      background:transparent;
    }
    .body::-webkit-scrollbar-thumb{
      background:#334155;
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb:hover{
      background:#475569;
    }
    .meta{
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-top:4px;
      gap:8px;
      flex-wrap:wrap;
    }
    .created{
      font-size:0.78rem;
      color:#64748b;
      white-space:nowrap;
    }
    .btns{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    }
    .btn{
      background:rgba(30,41,59,0.9);
      border:2px solid #334155;
      color:#e6eef8;
      padding:9px 14px;
      border-radius:12px;
      cursor:pointer;
      font-size:0.95rem;
      font-weight:600;
      transition:all 220ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      position:relative;
      overflow:hidden;
      white-space:nowrap;
      display:inline-flex;
      align-items:center;
      gap:6px;
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
      background:rgba(51,65,85,1);
      border-color:rgba(124,58,237,0.7);
      color:#e6eef8;
      transform:translateY(-2px);
      box-shadow:0 6px 16px rgba(124,58,237,0.3), 0 2px 6px rgba(0,0,0,0.4);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    }
    .deleteBtn:hover{
      background:#dc2626;
      border-color:#ef4444;
      color:white;
      box-shadow:0 6px 16px rgba(220,38,38,0.4), 0 2px 6px rgba(0,0,0,0.4);
    }
    .archived{opacity:0.6}
  </style>
  <article class="note-card">
    <div class="title"></div>
    <div class="body"></div>
    <div class="meta">
      <div class="created"></div>
      <div class="btns">
        <button class="btn archiveBtn" title="Archive">
          <i class="fas fa-archive"></i>
          <span class="btn-text">Archive</span>
        </button>
        <button class="btn deleteBtn" title="Delete">
          <i class="fas fa-trash"></i>
          <span class="btn-text">Delete</span>
        </button>
      </div>
    </div>
  </article>
`;

class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['data-id', 'archived', 'title', 'body', 'created-at'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.titleEl = this.shadowRoot.querySelector('.title');
    this.bodyEl = this.shadowRoot.querySelector('.body');
    this.createdEl = this.shadowRoot.querySelector('.created');
    this.archiveBtn = this.shadowRoot.querySelector('.archiveBtn');
    this.deleteBtn = this.shadowRoot.querySelector('.deleteBtn');

    this.onArchive = this.onArchive.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
  }

  connectedCallback() {
    this.archiveBtn.addEventListener('click', this.onArchive);
    this.deleteBtn.addEventListener('click', this.onDelete);
    this.addEventListener('keydown', this.onKeydown);
    this.render();

    // enter animation
    requestAnimationFrame(() => {
      this.classList.add('enter');
    });
  }

  disconnectedCallback() {
    this.archiveBtn.removeEventListener('click', this.onArchive);
    this.deleteBtn.removeEventListener('click', this.onDelete);
    this.removeEventListener('keydown', this.onKeydown);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) this.render();
  }

  set data(note) {
    this._data = note;
    this.setAttribute('data-id', note.id);
    if (note.archived) this.setAttribute('archived', 'true');
    else this.removeAttribute('archived');
    if (note.title) this.setAttribute('title', note.title);
    if (note.body) this.setAttribute('body', note.body);
    if (note.createdAt) this.setAttribute('created-at', note.createdAt);
    this.render();
  }

  get data() {
    return (
      this._data || {
        id: this.getAttribute('data-id'),
        title: this.getAttribute('title'),
        body: this.getAttribute('body'),
        createdAt: this.getAttribute('created-at'),
        archived: this.hasAttribute('archived'),
      }
    );
  }

  onArchive() {
    this.dispatchEvent(
      new CustomEvent('note-archive', {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  onDelete() {
    this.dispatchEvent(
      new CustomEvent('note-delete', {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  onKeydown(e) {
    // keyboard shortcuts when the host is focused
    if (e.key === 'Delete') {
      this.onDelete();
    }
    if (e.key === 'a' || e.key === 'A') {
      this.onArchive();
    }
  }

  render() {
    const n = this.data || {};
    this.titleEl.textContent = n.title || this.getAttribute('title') || '';
    this.bodyEl.textContent = n.body || this.getAttribute('body') || '';
    const createdAt = n.createdAt || this.getAttribute('created-at');
    this.createdEl.textContent = createdAt
      ? new Date(createdAt).toLocaleString()
      : '';
    // update archived state and button label
    const btnText = this.archiveBtn.querySelector('.btn-text');
    const btnIcon = this.archiveBtn.querySelector('i');
    if (this.hasAttribute('archived')) {
      this.shadowRoot.querySelector('article').classList.add('archived');
      if (btnText) btnText.textContent = 'Unarchive';
      if (btnIcon) btnIcon.className = 'fas fa-box-open';
    } else {
      this.shadowRoot.querySelector('article').classList.remove('archived');
      if (btnText) btnText.textContent = 'Archive';
      if (btnIcon) btnIcon.className = 'fas fa-archive';
    }

    // update accessible label on host
    const snippet = (n.body || this.getAttribute('body') || '')
      .slice(0, 60)
      .replace(/\n/g, ' ');
    this.setAttribute(
      'aria-label',
      `${n.title || this.getAttribute('title') || 'Note'} — ${snippet}`
    );
  }
}

customElements.define('note-item', NoteItem);
export default NoteItem;
