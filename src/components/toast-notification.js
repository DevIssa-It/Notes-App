import { toastNotificationStyles } from './styles/toast-notification-styles.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    ${toastNotificationStyles}
  </style>
  
  <div class="toast">
    <div class="icon"></div>
    <div class="content">
      <div class="title"></div>
      <div class="message"></div>
    </div>
    <button class="close-btn">
      <i class="fas fa-times"></i>
    </button>
  </div>
`;

class ToastNotification extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.toast = this.shadowRoot.querySelector('.toast');
    this.iconEl = this.shadowRoot.querySelector('.icon');
    this.titleEl = this.shadowRoot.querySelector('.title');
    this.messageEl = this.shadowRoot.querySelector('.message');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    
    this.autoCloseTimer = null;
  }
  
  connectedCallback() {
    this.closeBtn.addEventListener('click', () => this.hide());
  }
  
  show({ type = 'info', title = '', message = '', duration = 3000 }) {
    // Reset classes
    this.toast.className = 'toast';
    this.toast.classList.add(type);
    
    // Set icon based on type
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    this.iconEl.textContent = icons[type] || icons.info;
    
    // Set content
    this.titleEl.textContent = title;
    this.messageEl.textContent = message;
    
    // Show toast
    this.setAttribute('visible', '');
    
    // Auto-hide after duration
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
    
    if (duration > 0) {
      this.autoCloseTimer = setTimeout(() => this.hide(), duration);
    }
  }
  
  hide() {
    this.style.animation = 'slideOut 300ms ease-out';
    setTimeout(() => {
      this.removeAttribute('visible');
      this.style.animation = '';
    }, 300);
  }
}

customElements.define('toast-notification', ToastNotification);
export default ToastNotification;
