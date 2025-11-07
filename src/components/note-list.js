const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      align-items: start;
    }
    ::slotted(note-item) {
      display: flex;
      width: 100%;
      min-width: 0;
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
}

customElements.define('note-list', NoteList);
export default NoteList;
