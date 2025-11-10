/**
 * Note Skeleton Component
 * Loading placeholder for note cards
 */

class NoteSkeleton extends HTMLElement {
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
          display: block;
        }

        .skeleton-card {
          background: linear-gradient(145deg, #1e293b, rgba(30, 41, 59, 0.8));
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 20px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .skeleton-title {
          height: 24px;
          width: 70%;
          background: linear-gradient(
            90deg,
            rgba(51, 65, 85, 0.6) 0%,
            rgba(71, 85, 105, 0.8) 50%,
            rgba(51, 65, 85, 0.6) 100%
          );
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-badge {
          height: 20px;
          width: 60px;
          background: linear-gradient(
            90deg,
            rgba(124, 58, 237, 0.2) 0%,
            rgba(124, 58, 237, 0.4) 50%,
            rgba(124, 58, 237, 0.2) 100%
          );
          background-size: 200% 100%;
          border-radius: 12px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .skeleton-line {
          height: 14px;
          background: linear-gradient(
            90deg,
            rgba(51, 65, 85, 0.4) 0%,
            rgba(71, 85, 105, 0.6) 50%,
            rgba(51, 65, 85, 0.4) 100%
          );
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-line:nth-child(1) {
          width: 95%;
        }

        .skeleton-line:nth-child(2) {
          width: 88%;
          animation-delay: 0.1s;
        }

        .skeleton-line:nth-child(3) {
          width: 92%;
          animation-delay: 0.2s;
        }

        .skeleton-line:nth-child(4) {
          width: 60%;
          animation-delay: 0.3s;
        }

        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .skeleton-date {
          height: 12px;
          width: 100px;
          background: linear-gradient(
            90deg,
            rgba(51, 65, 85, 0.3) 0%,
            rgba(71, 85, 105, 0.5) 50%,
            rgba(51, 65, 85, 0.3) 100%
          );
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
          animation-delay: 0.4s;
        }

        .skeleton-actions {
          display: flex;
          gap: 8px;
        }

        .skeleton-btn {
          width: 32px;
          height: 32px;
          background: linear-gradient(
            90deg,
            rgba(51, 65, 85, 0.4) 0%,
            rgba(71, 85, 105, 0.6) 50%,
            rgba(51, 65, 85, 0.4) 100%
          );
          background-size: 200% 100%;
          border-radius: 8px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-btn:nth-child(1) {
          animation-delay: 0.5s;
        }

        .skeleton-btn:nth-child(2) {
          animation-delay: 0.6s;
        }

        .skeleton-btn:nth-child(3) {
          animation-delay: 0.7s;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      </style>

      <div class="skeleton-card">
        <div class="skeleton-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-badge"></div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
        </div>
        <div class="skeleton-footer">
          <div class="skeleton-date"></div>
          <div class="skeleton-actions">
            <div class="skeleton-btn"></div>
            <div class="skeleton-btn"></div>
            <div class="skeleton-btn"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('note-skeleton', NoteSkeleton);
