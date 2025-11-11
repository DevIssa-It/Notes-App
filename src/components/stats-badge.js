/**
 * Stats Badge Component (uses shared styles)
 */

import { sharedCss, sharedSheet } from './shared-styles.js';

class StatsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Use constructible stylesheet when available
    if (sharedSheet && this.shadowRoot.adoptedStyleSheets !== undefined) {
      this.shadowRoot.adoptedStyleSheets = [sharedSheet];
    } else {
      const style = document.createElement('style');
      style.textContent = sharedCss;
      this.shadowRoot.appendChild(style);
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML += `
      <div class="stats-container" part="stats">
        <div class="stat-item">
          <span class="stat-icon">📝</span>
          <span class="stat-count" id="activeCount">0</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-icon">📦</span>
          <span class="stat-count" id="archivedCount">0</span>
          <span class="stat-label">Archived</span>
        </div>
      </div>
    `;
  }

  /**
   * Update stats with animated counter
   * @param {number} activeCount - Number of active notes
   * @param {number} archivedCount - Number of archived notes
   */
  updateStats(activeCount, archivedCount) {
    const activeEl = this.shadowRoot.getElementById('activeCount');
    const archivedEl = this.shadowRoot.getElementById('archivedCount');

    if (activeEl && archivedEl) {
      this.animateCount(activeEl, parseInt(activeEl.textContent, 10), activeCount);
      this.animateCount(archivedEl, parseInt(archivedEl.textContent, 10), archivedCount);
    }
  }

  /**
   * Animate counter from old to new value
   * @param {HTMLElement} element - Element to update
   * @param {number} start - Starting value
   * @param {number} end - Ending value
   */
  animateCount(element, start, end) {
    if (start === end) return;

    const duration = 300;
    const range = end - start;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(start + range * progress);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }
}

customElements.define('stats-badge', StatsBadge);
