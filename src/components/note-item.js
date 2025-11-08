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
      background: linear-gradient(135deg, var(--card-gradient), var(--input-bg));
      padding:22px;
      border-radius:18px;
      border:2px solid var(--card-border);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
      height:300px;
      display:flex;
      flex-direction:column;
      gap:14px;
      transition:transform 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms ease, background 300ms ease;
      position:relative;
      overflow:hidden;
      width:100%;
      cursor:pointer;
      backdrop-filter: blur(10px);
    }
    .note-card.pinned {
      border-color: #f59e0b;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), var(--card-gradient));
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .note-card::before{
      content:'';
      position:absolute;
      top:0;
      left:0;
      right:0;
      height:5px;
      background:linear-gradient(90deg,#7c3aed,#06b6d4,#10b981);
      opacity:0;
      transition:opacity 300ms ease;
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    }
    .note-card.pinned::before{
      background:linear-gradient(90deg,#f59e0b,#eab308,#fbbf24);
      opacity:1;
    }
    .note-card::after{
      content:'';
      position:absolute;
      bottom:0;
      right:0;
      width:150px;
      height:150px;
      background:radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%);
      opacity:0;
      transition:opacity 300ms ease;
      pointer-events:none;
    }
    .note-card:hover{
      transform:translateY(-6px) scale(1.02);
      box-shadow: 0 12px 32px rgba(124, 58, 237, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color:rgba(124,58,237,0.5);
    }
    .note-card:hover::before{
      opacity:1;
    }
    .note-card:hover::after{
      opacity:1;
    }
    .title{
      font-weight:700;
      font-size:1.1rem;
      color: var(--text-primary);
      letter-spacing:0.01em;
      word-wrap:break-word;
      overflow-wrap:break-word;
      line-height:1.4;
      position:relative;
      padding-bottom:8px;
      margin-bottom:4px;
    }
    .title::after{
      content:'';
      position:absolute;
      bottom:0;
      left:0;
      width:40px;
      height:3px;
      background:linear-gradient(90deg, var(--accent), var(--accent-2));
      border-radius:2px;
      transition:width 300ms ease;
    }
    .note-card:hover .title::after{
      width:80px;
    }
    .body{
      white-space:pre-wrap;
      font-size:0.92rem;
      color: var(--text-secondary);
      flex:1;
      line-height:1.6;
      word-wrap:break-word;
      overflow-wrap:break-word;
      overflow-y:auto;
      scrollbar-width:thin;
      scrollbar-color: rgba(124, 58, 237, 0.3) transparent;
      padding-right:4px;
    }
    .body::-webkit-scrollbar{
      width:6px;
    }
    .body::-webkit-scrollbar-track{
      background:transparent;
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb{
      background: linear-gradient(180deg, var(--accent), var(--accent-2));
      border-radius:3px;
    }
    .body::-webkit-scrollbar-thumb:hover{
      background: linear-gradient(180deg, var(--accent-2), var(--accent));
    }
    .meta{
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      margin-top:auto;
      gap:12px;
      flex-wrap:wrap;
      padding-top:8px;
      border-top:1px solid rgba(124, 58, 237, 0.08);
    }
    .created{
      font-size:0.8rem;
      color: var(--muted);
      white-space:nowrap;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.08));
      padding: 6px 12px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: 1px solid rgba(124, 58, 237, 0.1);
      flex-shrink:0;
    }
    .created::before{
      content: '🕐';
      font-size: 0.9rem;
    }
    .btns{
      display:flex;
      gap:6px;
      flex-wrap:wrap;
      justify-content:flex-end;
      align-items:center;
    }
    .btn{
      background: linear-gradient(135deg, var(--input-bg), var(--input-bg-focus));
      border:2px solid var(--card-border);
      color: var(--text-primary);
      padding:8px 14px;
      border-radius:10px;
      cursor:pointer;
      font-size:0.85rem;
      font-weight:600;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      position:relative;
      overflow:hidden;
      white-space:nowrap;
      display:inline-flex;
      align-items:center;
      gap:6px;
      flex-shrink:0;
    }
    .btn i{
      font-size:0.8rem;
    }
    .btn-text{
      font-size:0.82rem;
    }
    .btn::before{
      content:'';
      position:absolute;
      top:50%;
      left:50%;
      width:0;
      height:0;
      border-radius:50%;
      background:rgba(124, 58, 237, 0.1);
      transform:translate(-50%, -50%);
      transition:width 400ms ease, height 400ms ease;
    }
    .btn:hover::before{
      width:300px;
      height:300px;
    }
    .btn:hover{
      transform:translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    .btn:active{
      transform:translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .copyBtn{
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.05));
      border-color: rgba(6, 182, 212, 0.3);
      color: #0891b2;
    }
    .copyBtn:hover{
      background:linear-gradient(135deg, #06b6d4, #0891b2);
      border-color:transparent;
      color:white;
      box-shadow:0 4px 16px rgba(6, 182, 212, 0.4);
    }
    .copyBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .archiveBtn{
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(99, 102, 241, 0.05));
      border-color: rgba(124, 58, 237, 0.3);
      color: var(--accent);
    }
    .archiveBtn:hover{
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
    }
    .archiveBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .deleteBtn{
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.05));
      border-color: rgba(220, 38, 38, 0.3);
      color: #dc2626;
    }
    .deleteBtn:hover{
      background:linear-gradient(135deg, #dc2626, #ef4444);
      border-color:transparent;
      color:white;
      box-shadow:0 4px 16px rgba(220, 38, 38, 0.4);
    }
    .deleteBtn:hover::before{
      background:rgba(255, 255, 255, 0.1);
    }
    .pinBtn{
      position:absolute;
      top:14px;
      right:14px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border:2px solid rgba(245, 158, 11, 0.3);
      color: #78716c;
      padding:6px 12px;
      border-radius:8px;
      cursor:pointer;
      font-size:0.82rem;
      font-weight:600;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      opacity:0;
      visibility:hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display:flex;
      align-items:center;
      gap:5px;
      z-index:10;
      pointer-events:auto;
    }
    .pinBtn i{
      font-size:0.9rem;
      pointer-events:none;
    }
    .pinBtn span{
      pointer-events:none;
    }
    .note-card:hover .pinBtn{
      opacity:1;
      visibility:visible;
    }
    .pinBtn.pinned{
      opacity:1;
      visibility:visible;
      background:linear-gradient(135deg, #f59e0b, #eab308);
      border-color:transparent;
      color:white;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }
    .pinBtn:hover{
      transform:translateY(-2px);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.5);
      background:linear-gradient(135deg, #fbbf24, #f59e0b);
      border-color:#f59e0b;
    }
    .pinBtn.pinned:hover{
      background:linear-gradient(135deg, #fbbf24, #f59e0b);
    }
    .favoriteBtn{
      position:absolute;
      top:14px;
      right:90px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border:2px solid rgba(239, 68, 68, 0.3);
      color: #78716c;
      padding:6px 12px;
      border-radius:8px;
      cursor:pointer;
      font-size:0.82rem;
      font-weight:600;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      opacity:0;
      visibility:hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display:flex;
      align-items:center;
      gap:5px;
      z-index:10;
      pointer-events:auto;
    }
    .favoriteBtn i{
      font-size:0.9rem;
      pointer-events:none;
    }
    .favoriteBtn span{
      pointer-events:none;
    }
    .note-card:hover .favoriteBtn{
      opacity:1;
      visibility:visible;
    }
    .favoriteBtn.favorited{
      opacity:1;
      visibility:visible;
      background:linear-gradient(135deg, #ef4444, #dc2626);
      border-color:transparent;
      color:white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }
    .favoriteBtn:hover{
      transform:scale(1.15);
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
    }
    .favoriteBtn:hover.favorited{
      animation: heartbeat 0.6s ease-in-out;
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1.15); }
      25% { transform: scale(1.3); }
      50% { transform: scale(1.15); }
      75% { transform: scale(1.25); }
    }
    
    /* Responsive: hide button text on small cards */
    @media (max-width: 480px) {
      .btn-text{
        display:none;
      }
      .btn{
        padding:8px 10px;
        gap:0;
      }
      .btn i{
        font-size:0.9rem;
      }
      .btns{
        gap:4px;
      }
    }
    
    .archived{opacity:0.6}
  </style>
  <article class="note-card">
    <button class="favoriteBtn" title="Add to favorites">
      <i class="fas fa-heart"></i>
      <span>Favorit</span>
    </button>
    <button class="pinBtn" title="Pin note">
      <i class="fas fa-map-pin"></i>
      <span>Pin</span>
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
    e.preventDefault(); // Prevent default action
    
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
    e.preventDefault(); // Prevent default action
    
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
