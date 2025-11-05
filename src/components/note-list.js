const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      align-items: start;
    }
    ::slotted(note-item){
      display: block;
      width: 100%;
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
