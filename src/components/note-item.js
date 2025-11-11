import { formatRelativeTime } from '../utils.js';
import { sharedCss, sharedSheet } from './shared-styles.js';
import { noteItemStyles } from './styles/note-item-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${noteItemStyles}
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
    // Apply shared stylesheet when possible to reuse common rules
    if (sharedSheet && this.shadowRoot.adoptedStyleSheets !== undefined) {
      this.shadowRoot.adoptedStyleSheets = [sharedSheet];
    } else {
      const s = document.createElement('style');
      s.textContent = sharedCss;
      this.shadowRoot.appendChild(s);
    }

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
