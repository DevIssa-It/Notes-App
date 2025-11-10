class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._loadTheme();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :host {
          display: inline-block;
        }

        .theme-toggle {
          position: relative;
          width: 60px;
          height: 30px;
          background: rgba(100, 116, 139, 0.3);
          border-radius: 15px;
          cursor: pointer;
          transition: background 0.3s ease;
          border: 2px solid #334155;
        }

        .theme-toggle:hover {
          background: rgba(100, 116, 139, 0.5);
        }

        .theme-toggle.light {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-color: #f59e0b;
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .theme-toggle.light .toggle-slider {
          transform: translateX(30px);
          background: #fef3c7;
        }

        .icon {
          font-size: 0.75rem;
          transition: opacity 0.2s ease;
        }

        .icon-moon {
          color: #7c3aed;
        }

        .icon-sun {
          color: #f59e0b;
        }

        .theme-toggle:not(.light) .icon-sun,
        .theme-toggle.light .icon-moon {
          display: none;
        }
      </style>

      <button 
        class="theme-toggle" 
        id="themeToggle"
        role="switch"
        aria-checked="false"
        aria-label="Toggle dark/light mode"
        title="Toggle theme"
      >
        <span class="toggle-slider">
          <i class="fas fa-moon icon icon-moon"></i>
          <i class="fas fa-sun icon icon-sun"></i>
        </span>
      </button>
    `;

    this._attachEventListeners();
  }

  _attachEventListeners() {
    const toggle = this.shadowRoot.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this._toggleTheme());
    }
  }

  _loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this._applyTheme(savedTheme);
  }

  _toggleTheme() {
    const toggle = this.shadowRoot.getElementById('themeToggle');
    const isLight = toggle.classList.contains('light');
    const newTheme = isLight ? 'dark' : 'light';
    
    // Add ripple animation effect
    this._createRippleEffect(newTheme);
    
    // Apply theme after animation starts
    setTimeout(() => {
      this._applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);

      // Dispatch event for other components
      this.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme: newTheme },
        bubbles: true,
        composed: true,
      }));
    }, 300);
  }

  _createRippleEffect(theme) {
    // Create ripple overlay
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${theme === 'light' ? 'radial-gradient(circle, #fbbf24, #f59e0b)' : 'radial-gradient(circle, #1e293b, #0f172a)'};
      transform: translate(-50%, -50%);
      z-index: 9999;
      pointer-events: none;
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.95;
    `;
    document.body.appendChild(ripple);
    
    // Trigger animation
    requestAnimationFrame(() => {
      const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.opacity = '0';
    });
    
    // Clean up after animation
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 800);
  }

  _applyTheme(theme) {
    const toggle = this.shadowRoot.getElementById('themeToggle');
    
    if (theme === 'light') {
      toggle.classList.add('light');
      toggle.setAttribute('aria-checked', 'true');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      toggle.classList.remove('light');
      toggle.setAttribute('aria-checked', 'false');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
