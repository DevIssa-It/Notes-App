import { formatRelativeTime } from '../utils.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      transition: all 300ms ease;
    }
    
    /* Use CSS variables from parent document */
    
    .note-card{
      box-sizing:border-box;
      background: var(--card-gradient);
      padding:20px;
      border-radius:16px;
      border:2px solid var(--card-border);
      box-shadow: var(--shadow-md);
      height:280px;
      display:flex;
      flex-direction:column;
      gap:12px;
      transition:transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms ease, background 250ms ease;
      position:relative;
      overflow:hidden;
      width:100%;
      cursor:pointer;
    }
    .note-card.pinned {
      border-color: #f59e0b;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3), var(--shadow-md);
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
    .note-card.pinned::before{
      background:linear-gradient(90deg,#f59e0b,#eab308);
      opacity:1;
    }
    .note-card:hover{
      transform:translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color:rgba(124,58,237,0.6);
    }
    .note-card:hover::before{
      opacity:1;
    }
    .title{
      font-weight:700;
      font-size:1.05rem;
      color: var(--text-primary);
      letter-spacing:0.01em;
      word-wrap:break-word;
      overflow-wrap:break-word;
    }
    .body{
      white-space:pre-wrap;
      font-size:0.9rem;
      color: var(--text-secondary);
      flex:1;
      line-height:1.5;
      word-wrap:break-word;
      overflow-wrap:break-word;
      overflow-y:auto;
      scrollbar-width:thin;
      scrollbar-color: var(--card-border) transparent;
    }
    .body::-webkit-scrollbar{
      width:6px;
    }
    .body::-webkit-scrollbar-track{
      background:transparent;
    }
    .body::-webkit-scrollbar-thumb{
      background: var(--card-border);
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb:hover{
      background: var(--input-border);
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
      color: var(--muted);
      white-space:nowrap;
    }
    .btns{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    }
    .btn{
      background: var(--input-bg);
      border:2px solid var(--card-border);
      color: var(--text-primary);
      padding:9px 14px;
      border-radius:12px;
      cursor:pointer;
      font-size:0.95rem;
      font-weight:600;
      transition:all 220ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: var(--shadow-sm);
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
      background: var(--input-bg-focus);
      border-color: var(--accent);
      color: var(--text-primary);
      transform:translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow: var(--shadow-sm);
    }
    .deleteBtn:hover{
      background:#dc2626;
      border-color:#ef4444;
      color:white;
      box-shadow:0 6px 16px rgba(220,38,38,0.4), 0 2px 6px rgba(0,0,0,0.4);
    }
    .pinBtn{
      position:absolute;
      top:12px;
      right:12px;
      background: var(--input-bg);
      border:2px solid var(--card-border);
      color: var(--text-secondary);
      padding:6px 10px;
      border-radius:8px;
      cursor:pointer;
      font-size:1rem;
      transition:all 220ms ease;
      opacity:0;
      visibility:hidden;
    }
    .note-card:hover .pinBtn{
      opacity:1;
      visibility:visible;
    }
    .pinBtn.pinned{
      opacity:1;
      visibility:visible;
      background:#f59e0b;
      border-color:#eab308;
      color:white;
    }
    .pinBtn:hover{
      transform:scale(1.1) rotate(15deg);
    }
    .favoriteBtn{
      position:absolute;
      top:12px;
      right:52px;
      background: var(--input-bg);
      border:2px solid var(--card-border);
      color: var(--text-secondary);
      padding:6px 10px;
      border-radius:8px;
      cursor:pointer;
      font-size:1rem;
      transition:all 220ms ease;
      opacity:0;
      visibility:hidden;
    }
    .note-card:hover .favoriteBtn{
      opacity:1;
      visibility:visible;
    }
    .favoriteBtn.favorited{
      opacity:1;
      visibility:visible;
      background:#ef4444;
      border-color:#dc2626;
      color:white;
    }
    .favoriteBtn:hover{
      transform:scale(1.15);
    }
    .copyBtn:hover{
      background:#06b6d4;
      border-color:#0891b2;
      color:white;
      box-shadow:0 6px 16px rgba(6,182,212,0.4), 0 2px 6px rgba(0,0,0,0.4);
    }
    .archived{opacity:0.6}
  </style>
  <article class="note-card">
    <button class="favoriteBtn" title="Add to favorites">
      <i class="fas fa-heart"></i>
    </button>
    <button class="pinBtn" title="Pin note">
      <i class="fas fa-thumbtack"></i>
    </button>
    <div class="title"></div>
    <div class="body"></div>
    <div class="meta">
      <div class="created"></div>
      <div class="btns">
        <button class="btn copyBtn" title="Copy to clipboard">
          <i class="fas fa-copy"></i>
          <span class="btn-text">Copy</span>
        </button>
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
    return ['data-id', 'archived', 'created-at', 'pinned', 'favorited'];
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
    this.pinBtn = this.shadowRoot.querySelector('.pinBtn');
    this.favoriteBtn = this.shadowRoot.querySelector('.favoriteBtn');
    this.copyBtn = this.shadowRoot.querySelector('.copyBtn');

    this.onArchive = this.onArchive.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onFavorite = this.onFavorite.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  connectedCallback() {
    this.archiveBtn.addEventListener('click', this.onArchive);
    this.deleteBtn.addEventListener('click', this.onDelete);
    this.pinBtn.addEventListener('click', this.onPin);
    this.favoriteBtn.addEventListener('click', this.onFavorite);
    this.copyBtn.addEventListener('click', this.onCopy);
    this.addEventListener('keydown', this.onKeydown);
    
    // Add click listener to the card itself
    const card = this.shadowRoot.querySelector('.note-card');
    if (card) {
      card.addEventListener('click', this.onClick);
    }
    
    this.render();

    // enter animation
    requestAnimationFrame(() => {
      this.classList.add('enter');
    });
  }

  disconnectedCallback() {
    this.archiveBtn.removeEventListener('click', this.onArchive);
    this.deleteBtn.removeEventListener('click', this.onDelete);
    this.pinBtn.removeEventListener('click', this.onPin);
    this.favoriteBtn.removeEventListener('click', this.onFavorite);
    this.copyBtn.removeEventListener('click', this.onCopy);
    this.removeEventListener('keydown', this.onKeydown);
    
    const card = this.shadowRoot.querySelector('.note-card');
    if (card) {
      card.removeEventListener('click', this.onClick);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) this.render();
  }

  set note(noteData) {
    if (!noteData) return;
    
    this._data = noteData;
    this.setAttribute('data-id', noteData.id);
    
    if (noteData.archived) {
      this.setAttribute('archived', 'true');
    } else {
      this.removeAttribute('archived');
    }
    
    if (noteData.pinned) {
      this.setAttribute('pinned', 'true');
    } else {
      this.removeAttribute('pinned');
    }
    
    if (noteData.favorited) {
      this.setAttribute('favorited', 'true');
    } else {
      this.removeAttribute('favorited');
    }
    
    // Use dataset to store title and body to avoid conflicts
    this.dataset.noteTitle = noteData.title || '';
    this.dataset.noteBody = noteData.body || '';
    
    if (noteData.createdAt) {
      this.setAttribute('created-at', noteData.createdAt);
    }
    
    this.render();
  }

  get note() {
    return this._data || {
      id: this.getAttribute('data-id'),
      title: this.dataset.noteTitle || '',
      body: this.dataset.noteBody || '',
      createdAt: this.getAttribute('created-at'),
      archived: this.hasAttribute('archived'),
      pinned: this.hasAttribute('pinned'),
      favorited: this.hasAttribute('favorited'),
    };
  }

  set data(note) {
    this.note = note;
  }

  get data() {
    return this.note;
  }

  onArchive(e) {
    e.stopPropagation(); // Prevent card click event
    
    const isArchived = this.hasAttribute('archived');
    const eventName = isArchived ? 'note-unarchive' : 'note-archive';
    
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  onDelete(e) {
    e.stopPropagation(); // Prevent card click event
    
    this.dispatchEvent(
      new CustomEvent('note-delete', {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  onPin(e) {
    e.stopPropagation(); // Prevent card click event
    
    const isPinned = this.hasAttribute('pinned');
    const eventName = isPinned ? 'note-unpin' : 'note-pin';
    
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  onFavorite(e) {
    e.stopPropagation(); // Prevent card click event
    
    const isFavorited = this.hasAttribute('favorited');
    const eventName = isFavorited ? 'note-unfavorite' : 'note-favorite';
    
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { id: this.getAttribute('data-id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  async onCopy(e) {
    e.stopPropagation(); // Prevent card click event
    
    const n = this.note;
    const text = `${n.title}\n\n${n.body}`;
    
    try {
      await navigator.clipboard.writeText(text);
      
      // Show feedback
      const btnText = this.copyBtn.querySelector('.btn-text');
      const btnIcon = this.copyBtn.querySelector('i');
      if (btnText) btnText.textContent = 'Copied!';
      if (btnIcon) btnIcon.className = 'fas fa-check';
      
      // Reset after 2 seconds
      setTimeout(() => {
        if (btnText) btnText.textContent = 'Copy';
        if (btnIcon) btnIcon.className = 'fas fa-copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  onClick(e) {
    // Don't navigate if user clicked on a button
    const path = e.composedPath();
    const isButton = path.some(el => el.tagName === 'BUTTON');
    
    if (isButton) {
      return;
    }
    
    this.dispatchEvent(
      new CustomEvent('note-click', {
        detail: { 
          id: this.getAttribute('data-id'),
          note: this.note,
        },
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
    const n = this.note;
    
    // Render title and body from cached data
    this.titleEl.textContent = n.title || '';
    this.bodyEl.textContent = n.body || '';
    
    // Render created date with relative time
    const createdAt = n.createdAt || this.getAttribute('created-at');
    this.createdEl.textContent = createdAt
      ? formatRelativeTime(createdAt)
      : '';
    
    // Add tooltip with full date
    if (createdAt) {
      this.createdEl.title = new Date(createdAt).toLocaleString();
    }
    
    // Update pinned state
    const card = this.shadowRoot.querySelector('article');
    if (this.hasAttribute('pinned')) {
      card.classList.add('pinned');
      this.pinBtn.classList.add('pinned');
      this.pinBtn.title = 'Unpin note';
    } else {
      card.classList.remove('pinned');
      this.pinBtn.classList.remove('pinned');
      this.pinBtn.title = 'Pin note';
    }
    
    // Update favorited state
    if (this.hasAttribute('favorited')) {
      this.favoriteBtn.classList.add('favorited');
      this.favoriteBtn.title = 'Remove from favorites';
    } else {
      this.favoriteBtn.classList.remove('favorited');
      this.favoriteBtn.title = 'Add to favorites';
    }
    
    // Update archived state and button label
    const btnText = this.archiveBtn.querySelector('.btn-text');
    const btnIcon = this.archiveBtn.querySelector('i');
    if (this.hasAttribute('archived')) {
      card.classList.add('archived');
      if (btnText) btnText.textContent = 'Unarchive';
      if (btnIcon) btnIcon.className = 'fas fa-box-open';
    } else {
      card.classList.remove('archived');
      if (btnText) btnText.textContent = 'Archive';
      if (btnIcon) btnIcon.className = 'fas fa-archive';
    }

    // Update accessible label on host
    const snippet = (n.body || '').slice(0, 60).replace(/\n/g, ' ');
    this.setAttribute('aria-label', `${n.title || 'Note'} — ${snippet}`);
  }
}

customElements.define('note-item', NoteItem);
export default NoteItem;
