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
    .note-card.selected {
      border-color: var(--accent);
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), var(--card-gradient));
      transform: scale(0.98);
    }
    .select-checkbox {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 24px;
      height: 24px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 200ms ease;
      z-index: 10;
    }
    :host([selection-mode]) .select-checkbox,
    .note-card.selected .select-checkbox {
      opacity: 1;
    }
    .select-checkbox input {
      display: none;
    }
    .checkmark {
      display: block;
      width: 24px;
      height: 24px;
      border: 2px solid var(--accent);
      border-radius: 6px;
      background: var(--card);
      position: relative;
      transition: all 200ms ease;
    }
    .select-checkbox:hover .checkmark {
      transform: scale(1.1);
      border-color: var(--accent-2);
    }
    .select-checkbox input:checked ~ .checkmark {
      background: var(--accent);
      border-color: var(--accent);
    }
    .checkmark::after {
      content: '';
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 6px;
      height: 11px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    .select-checkbox input:checked ~ .checkmark::after {
      display: block;
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
    
    /* Quick Preview Tooltip */
    .note-card::before {
      content: attr(data-preview);
      position: absolute;
      bottom: -60px;
      left: 50%;
      transform: translateX(-50%) scale(0.9);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98));
      color: #e6eef8;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.75rem;
      white-space: nowrap;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(124, 58, 237, 0.3);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
      z-index: 100;
    }
    
    .note-card:hover::before {
      opacity: 1;
      transform: translateX(-50%) scale(1);
      bottom: -70px;
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
      align-items:center;
      margin-top:auto;
      gap:8px;
      padding-top:12px;
      border-top:1px solid rgba(124, 58, 237, 0.08);
      flex-wrap:wrap;
    }
    .created{
      font-size:0.75rem;
      color: var(--muted);
      white-space:nowrap;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(6, 182, 212, 0.08));
      padding: 5px 10px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border: 1px solid rgba(124, 58, 237, 0.1);
      flex-shrink:0;
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .created::before{
      content: '🕐';
      font-size: 0.85rem;
      flex-shrink: 0;
    }
    .btns{
      display:flex;
      gap:6px;
      align-items:center;
      position:relative;
      flex-shrink:0;
    }
    .quick-actions{
      display:flex;
      gap:4px;
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
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.2);
      color: #f59e0b;
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .pinBtn i,
    .favoriteBtn i,
    .moreBtn i{
      display:none;
    }
    .btn-emoji{
      font-size:1rem;
      pointer-events:none;
      line-height:1;
    }
    .pinBtn::after{
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .pinBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .pinBtn:hover::after,
    .pinBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .pinBtn:hover{
      background:rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
      color:#f59e0b;
      transform:scale(1.1);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
    }
    .pinBtn.pinned{
      color:#f59e0b;
      background:rgba(245, 158, 11, 0.2);
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }
    .pinBtn.pinned::after{
      content: 'Unpin note';
    }
    .favoriteBtn{
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #ef4444;
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .favoriteBtn::after{
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .favoriteBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .favoriteBtn:hover::after,
    .favoriteBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .favoriteBtn:hover{
      background:rgba(239, 68, 68, 0.15);
      border-color: #ef4444;
      color:#ef4444;
      transform:scale(1.1);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    }
    .favoriteBtn.favorited{
      color:#ef4444;
      background:rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    .favoriteBtn.favorited::after{
      content: 'Remove from favorites';
    }
    .moreBtn{
      background: var(--input-bg);
      border: 1px solid var(--card-border);
      color: var(--text-secondary);
      padding:4px;
      border-radius:8px;
      cursor:pointer;
      font-size:1.3rem;
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:32px;
      height:32px;
      position:relative;
    }
    .moreBtn::after{
      content: 'More actions';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .moreBtn::before{
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(4px);
      border: 5px solid transparent;
      border-top-color: rgba(0, 0, 0, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease;
      pointer-events: none;
      z-index: 1000;
    }
    .moreBtn:hover::after,
    .moreBtn:hover::before{
      opacity: 1;
      visibility: visible;
    }
    .moreBtn:hover{
      background:var(--accent);
      border-color: var(--accent);
      color:#fff;
      transform:rotate(90deg);
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
    }
    .dropdown-menu{
      position:absolute;
      bottom:36px;
      right:0;
      background:var(--card);
      border:2px solid var(--card-border);
      border-radius:12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      padding:6px;
      min-width:140px;
      max-width:180px;
      opacity:0;
      visibility:hidden;
      transform:translateY(10px) scale(0.95);
      transition:all 250ms cubic-bezier(0.4, 0, 0.2, 1);
      z-index:1000;
      backdrop-filter:blur(10px);
    }
    .dropdown-menu.show{
      opacity:1;
      visibility:visible;
      transform:translateY(0) scale(1);
    }
    .dropdown-item{
      background:transparent;
      border:none;
      color:var(--text-primary);
      padding:8px 12px;
      border-radius:8px;
      cursor:pointer;
      font-size:0.85rem;
      font-weight:500;
      transition:all 200ms ease;
      display:flex;
      align-items:center;
      gap:8px;
      width:100%;
      text-align:left;
    }
    .dropdown-item i{
      display:none;
    }
    .item-emoji{
      font-size:1rem;
      width:18px;
      text-align:center;
      flex-shrink:0;
      line-height:1;
    }
    .dropdown-item:hover{
      background:var(--input-bg);
    }
    .dropdown-item.copy:hover{
      background:rgba(6, 182, 212, 0.1);
      color:#06b6d4;
    }
    .dropdown-item.archive:hover{
      background:rgba(124, 58, 237, 0.1);
      color:var(--accent);
    }
    .dropdown-item.delete:hover{
      background:rgba(220, 38, 38, 0.1);
      color:#dc2626;
    }
    
    /* Responsive */
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
    <label class="select-checkbox">
      <input type="checkbox" class="checkbox-input">
      <span class="checkmark"></span>
    </label>
    <div class="title"></div>
    <div class="body"></div>
    <div class="meta">
      <div class="created"></div>
      <div class="btns">
        <div class="quick-actions">
          <button class="favoriteBtn" data-tooltip="Add to favorites">
            <i class="fas fa-heart"></i>
            <span class="btn-emoji">❤️</span>
          </button>
          <button class="pinBtn" data-tooltip="Pin to top">
            <i class="fas fa-map-pin"></i>
            <span class="btn-emoji">📌</span>
          </button>
        </div>
        <button class="moreBtn">
          <i class="fas fa-ellipsis-v"></i>
          <span class="btn-emoji">⋮</span>
        </button>
        <div class="dropdown-menu">
          <button class="dropdown-item copy">
            <span class="item-emoji">📋</span>
            <span>Copy note</span>
          </button>
          <button class="dropdown-item export">
            <span class="item-emoji">💾</span>
            <span>Export</span>
          </button>
          <button class="dropdown-item archive">
            <span class="item-emoji">📦</span>
            <span>Archive</span>
          </button>
          <button class="dropdown-item delete">
            <span class="item-emoji">🗑️</span>
            <span>Delete</span>
          </button>
        </div>
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
    this.pinBtn = this.shadowRoot.querySelector('.pinBtn');
    this.favoriteBtn = this.shadowRoot.querySelector('.favoriteBtn');
    this.moreBtn = this.shadowRoot.querySelector('.moreBtn');
    this.dropdownMenu = this.shadowRoot.querySelector('.dropdown-menu');
    this.archiveBtn = this.shadowRoot.querySelector('.dropdown-item.archive');
    this.deleteBtn = this.shadowRoot.querySelector('.dropdown-item.delete');
    this.copyBtn = this.shadowRoot.querySelector('.dropdown-item.copy');
    this.exportBtn = this.shadowRoot.querySelector('.dropdown-item.export');
    this.checkbox = this.shadowRoot.querySelector('.checkbox-input');
    this.card = this.shadowRoot.querySelector('.note-card');

    this.onArchive = this.onArchive.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onPin = this.onPin.bind(this);
    this.onFavorite = this.onFavorite.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onExport = this.onExport.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  connectedCallback() {
    this.archiveBtn.addEventListener('click', this.onArchive);
    this.deleteBtn.addEventListener('click', this.onDelete);
    this.pinBtn.addEventListener('click', this.onPin);
    this.favoriteBtn.addEventListener('click', this.onFavorite);
    this.copyBtn.addEventListener('click', this.onCopy);
    this.exportBtn.addEventListener('click', this.onExport);
    this.moreBtn.addEventListener('click', this.toggleDropdown);
    this.checkbox.addEventListener('change', this.onCheckboxChange);
    this.addEventListener('keydown', this.onKeydown);
    
    // Add click listener to the card itself
    if (this.card) {
      this.card.addEventListener('click', this.onClick);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdown);
    
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
    this.moreBtn.removeEventListener('click', this.toggleDropdown);
    this.removeEventListener('keydown', this.onKeydown);
    document.removeEventListener('click', this.closeDropdown);
    
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

  toggleDropdown(e) {
    e.stopPropagation(); // Prevent card click event
    e.preventDefault();
    
    this.dropdownMenu.classList.toggle('show');
  }

  closeDropdown(e) {
    // Close dropdown if clicking outside
    if (!this.contains(e.target)) {
      this.dropdownMenu.classList.remove('show');
    }
  }

  onCheckboxChange(e) {
    e.stopPropagation();
    const isChecked = this.checkbox.checked;
    
    if (isChecked) {
      this.card.classList.add('selected');
    } else {
      this.card.classList.remove('selected');
    }
    
    this.dispatchEvent(
      new CustomEvent('note-selection-changed', {
        detail: { 
          id: this.getAttribute('data-id'),
          selected: isChecked
        },
        bubbles: true,
        composed: true,
      })
    );
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
      const btnText = this.copyBtn.querySelector('span:last-child');
      const btnEmoji = this.copyBtn.querySelector('.item-emoji');
      if (btnText) btnText.textContent = 'Copied!';
      if (btnEmoji) btnEmoji.textContent = '✅';
      
      // Close dropdown and reset after 2 seconds
      setTimeout(() => {
        if (btnText) btnText.textContent = 'Copy note';
        if (btnEmoji) btnEmoji.textContent = '📋';
        this.closeDropdown();
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  onExport(e) {
    e.stopPropagation(); // Prevent card click event
    
    const n = this.note;
    const content = `${n.title}\n\n${n.body}\n\n---\nCreated: ${new Date(n.createdAt).toLocaleString()}`;
    
    // Create blob and download link
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Sanitize filename
    const filename = n.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show feedback
    const btnText = this.exportBtn.querySelector('span:last-child');
    const btnEmoji = this.exportBtn.querySelector('.item-emoji');
    if (btnText) btnText.textContent = 'Exported!';
    if (btnEmoji) btnEmoji.textContent = '✅';
    
    // Close dropdown and reset after 2 seconds
    setTimeout(() => {
      if (btnText) btnText.textContent = 'Export';
      if (btnEmoji) btnEmoji.textContent = '💾';
      this.closeDropdown();
    }, 2000);
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

  highlightText(text, query) {
    if (!query || !text) {
      return this.escapeHtml(text);
    }
    
    // Escape special regex characters in query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    // Escape HTML to prevent XSS, then add highlight
    const escapedText = this.escapeHtml(text);
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  render() {
    const n = this.note;
    const searchQuery = this.getAttribute('search-query') || '';
    
    // Render title and body with search highlighting
    this.titleEl.innerHTML = this.highlightText(n.title || '', searchQuery);
    this.bodyEl.innerHTML = this.highlightText(n.body || '', searchQuery);
    
    // Add preview tooltip
    const preview = `📝 ${n.title.substring(0, 30)}${n.title.length > 30 ? '...' : ''}`;
    if (this.card) {
      this.card.setAttribute('data-preview', preview);
    }
    
    // Render created date with relative time
    const createdAt = n.createdAt || this.getAttribute('created-at');
    const { lastModified } = n;
    
    // Show "Edited" text if note was modified
    if (lastModified && lastModified !== createdAt) {
      this.createdEl.innerHTML = `
        <span style="color: var(--text-secondary);">Created ${formatRelativeTime(createdAt)}</span>
        <br>
        <span style="color: var(--accent); font-weight: 600;">
          <i class="fas fa-edit" style="font-size: 0.85em;"></i>
          Edited ${formatRelativeTime(lastModified)}
        </span>
      `;
      this.createdEl.title = `Created: ${new Date(createdAt).toLocaleString()}\nLast edited: ${new Date(lastModified).toLocaleString()}`;
    } else {
      this.createdEl.textContent = createdAt
        ? formatRelativeTime(createdAt)
        : '';
      // Add tooltip with full date
      if (createdAt) {
        this.createdEl.title = new Date(createdAt).toLocaleString();
      }
    }
    
    // Update pinned state
    const card = this.shadowRoot.querySelector('article');
    if (this.hasAttribute('pinned')) {
      card.classList.add('pinned');
      this.pinBtn.classList.add('pinned');
      this.pinBtn.setAttribute('data-tooltip', 'Unpin from top');
    } else {
      card.classList.remove('pinned');
      this.pinBtn.classList.remove('pinned');
      this.pinBtn.setAttribute('data-tooltip', 'Pin to top');
    }
    
    // Update favorited state
    if (this.hasAttribute('favorited')) {
      this.favoriteBtn.classList.add('favorited');
      this.favoriteBtn.setAttribute('data-tooltip', 'Remove from favorites');
    } else {
      this.favoriteBtn.classList.remove('favorited');
      this.favoriteBtn.setAttribute('data-tooltip', 'Add to favorites');
    }
    
    // Update archived state and button label
    const btnText = this.archiveBtn.querySelector('span:last-child');
    const btnEmoji = this.archiveBtn.querySelector('.item-emoji');
    if (this.hasAttribute('archived')) {
      card.classList.add('archived');
      if (btnText) btnText.textContent = 'Restore note';
      if (btnEmoji) btnEmoji.textContent = '📤';
    } else {
      card.classList.remove('archived');
      if (btnText) btnText.textContent = 'Archive note';
      if (btnEmoji) btnEmoji.textContent = '📦';
    }

    // Update accessible label on host
    const snippet = (n.body || '').slice(0, 60).replace(/\n/g, ' ');
    this.setAttribute('aria-label', `${n.title || 'Note'} — ${snippet}`);
  }
}

customElements.define('note-item', NoteItem);
export default NoteItem;
