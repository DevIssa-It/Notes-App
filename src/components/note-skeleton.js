/**
 * Note Skeleton Component
 * Loading placeholder for note cards
 */

import { noteSkeletonStyles } from './styles/note-skeleton-styles.js';

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
        ${noteSkeletonStyles}
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
