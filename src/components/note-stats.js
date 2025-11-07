class NoteStats extends HTMLElement {
  constructor() {
    super();
    this._activeCount = 0;
    this._archivedCount = 0;
    this._totalCount = 0;
  }

  connectedCallback() {
    this.render();
  }

  set activeCount(value) {
    this._activeCount = value;
    this.updateDisplay();
  }

  set archivedCount(value) {
    this._archivedCount = value;
    this.updateDisplay();
  }

  set totalCount(value) {
    this._totalCount = value;
    this.updateDisplay();
  }

  updateDisplay() {
    const activeEl = this.querySelector('.stat-active .stat-value');
    const archivedEl = this.querySelector('.stat-archived .stat-value');
    const totalEl = this.querySelector('.stat-total .stat-value');

    if (activeEl) activeEl.textContent = this._activeCount;
    if (archivedEl) archivedEl.textContent = this._archivedCount;
    if (totalEl) totalEl.textContent = this._totalCount;
  }

  render() {
    this.innerHTML = `
      <div class="stats-container">
        <div class="stat-item stat-active">
          <i class="fas fa-sticky-note stat-icon"></i>
          <div class="stat-info">
            <span class="stat-value">${this._activeCount}</span>
            <span class="stat-label">Active</span>
          </div>
        </div>
        
        <div class="stat-item stat-archived">
          <i class="fas fa-archive stat-icon"></i>
          <div class="stat-info">
            <span class="stat-value">${this._archivedCount}</span>
            <span class="stat-label">Archived</span>
          </div>
        </div>
        
        <div class="stat-item stat-total">
          <i class="fas fa-chart-bar stat-icon"></i>
          <div class="stat-info">
            <span class="stat-value">${this._totalCount}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-stats', NoteStats);
