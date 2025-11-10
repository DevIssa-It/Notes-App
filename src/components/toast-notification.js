const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: none;
    }
    
    :host([visible]) {
      display: block;
      animation: slideIn 300ms ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    .toast {
      background: var(--card);
      border: 2px solid var(--card-border);
      border-radius: 12px;
      padding: 16px 20px;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(10px);
    }
    
    .toast.success {
      border-left: 4px solid #10b981;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--card));
    }
    
    .toast.error {
      border-left: 4px solid #ef4444;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), var(--card));
    }
    
    .toast.info {
      border-left: 4px solid #3b82f6;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), var(--card));
    }
    
    .toast.warning {
      border-left: 4px solid #f59e0b;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), var(--card));
    }
    
    .icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }
    
    .toast.success .icon {
      color: #10b981;
    }
    
    .toast.error .icon {
      color: #ef4444;
    }
    
    .toast.info .icon {
      color: #3b82f6;
    }
    
    .toast.warning .icon {
      color: #f59e0b;
    }
    
    .content {
      flex: 1;
    }
    
    .title {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .message {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    
    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 4px;
      font-size: 1.2rem;
      transition: all 200ms ease;
      flex-shrink: 0;
    }
    
    .close-btn:hover {
      color: var(--text-primary);
      transform: rotate(90deg);
    }
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
