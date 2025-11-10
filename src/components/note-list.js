const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      align-items: start;
    }
  </style>
  <slot></slot>
`;

class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    // Show skeletons on initial load
    if (this.childNodes.length === 0) {
      this.showSkeletons(3);
    }
  }

  /**
   * Show loading skeletons
   * @param {number} count - Number of skeletons to show
   */
  showSkeletons(count = 3) {
    this.innerHTML = '';
    for (let i = 0; i < count; i += 1) {
      const skeleton = document.createElement('note-skeleton');
      this.appendChild(skeleton);
    }
  }

  /**
   * Hide skeletons
   */
  hideSkeletons() {
    const skeletons = this.querySelectorAll('note-skeleton');
    skeletons.forEach(s => s.remove());
  }
}

customElements.define('note-list', NoteList);
export default NoteList;
