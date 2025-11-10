/**
 * Stats Badge Component
 * Displays note count statistics with animated counter
 */

class StatsBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        .stats-container {
          display: flex;
          gap: 12px;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stats-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: white;
          font-size: 14px;
          font-weight: 600;
        }

        .stat-icon {
          font-size: 16px;
        }

        .stat-count {
          font-size: 18px;
          font-weight: 700;
          min-width: 25px;
          text-align: center;
          animation: countPulse 0.3s ease;
        }

        @keyframes countPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.3);
        }
      </style>

      <div class="stats-container">
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
