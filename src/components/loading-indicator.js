import { loadingIndicatorStyles } from './styles/loading-indicator-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${loadingIndicatorStyles}
  </style>
  <div class="loader-container">
    <div class="spinner"></div>
    <p class="message">Loading...</p>
    <p class="submessage">Please wait</p>
  </div>
`;

class LoadingIndicator extends HTMLElement {
  static get observedAttributes() {
    return ['message', 'submessage'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.messageEl = this.shadowRoot.querySelector('.message');
    this.submessageEl = this.shadowRoot.querySelector('.submessage');
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render();
    }
  }

  show(message = 'Loading...', submessage = 'Please wait') {
    this.setAttribute('active', '');
    if (message) this.setAttribute('message', message);
    if (submessage) this.setAttribute('submessage', submessage);
  }

  hide() {
    this.removeAttribute('active');
  }

  render() {
    const message = this.getAttribute('message') || 'Loading...';
    const submessage = this.getAttribute('submessage') || 'Please wait';
    this.messageEl.textContent = message;
    this.submessageEl.textContent = submessage;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
export default LoadingIndicator;
