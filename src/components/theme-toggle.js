import { themeToggleStyles } from './styles/theme-toggle-styles.js';
import vercelAnalytics from '../vercel-analytics.js';

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this._loadTheme();
    this._setupSystemThemeDetection();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        ${themeToggleStyles}
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
    // Check if user has manually set a theme preference
    const savedTheme = localStorage.getItem('theme');
    const autoTheme = localStorage.getItem('theme-auto');
    
    if (savedTheme && autoTheme !== 'true') {
      // User has manually selected a theme
      this._applyTheme(savedTheme);
    } else {
      // Auto-detect system preference
      const systemTheme = this._getSystemTheme();
      this._applyTheme(systemTheme);
      
      // Mark as auto-detected if no manual preference exists
      if (!savedTheme) {
        localStorage.setItem('theme-auto', 'true');
      }
    }
  }

  _getSystemTheme() {
    // Check system preference using matchMedia
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  _setupSystemThemeDetection() {
    // Listen for system theme changes
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
      
      const handleSystemThemeChange = () => {
        const autoTheme = localStorage.getItem('theme-auto');
        
        // Only auto-switch if user hasn't manually selected a theme
        if (autoTheme === 'true') {
          const newTheme = this._getSystemTheme();
          this._applyTheme(newTheme);
          localStorage.setItem('theme', newTheme);
          
          // Dispatch event
          this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: newTheme, auto: true },
            bubbles: true,
            composed: true,
          }));
        }
      };
      
      // Add listeners for both dark and light mode changes
      darkModeQuery.addEventListener('change', handleSystemThemeChange);
      lightModeQuery.addEventListener('change', handleSystemThemeChange);
      
      // Store listeners for cleanup
      this._systemThemeListeners = {
        dark: { query: darkModeQuery, handler: handleSystemThemeChange },
        light: { query: lightModeQuery, handler: handleSystemThemeChange }
      };
    }
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
      
      // User manually selected theme, disable auto-switching
      localStorage.setItem('theme-auto', 'false');

      // Track analytics
      vercelAnalytics.trackThemeToggle(newTheme);

      // Dispatch event for other components
      this.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme: newTheme, auto: false },
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

  disconnectedCallback() {
    // Clean up system theme listeners
    if (this._systemThemeListeners) {
      this._systemThemeListeners.dark.query.removeEventListener('change', this._systemThemeListeners.dark.handler);
      this._systemThemeListeners.light.query.removeEventListener('change', this._systemThemeListeners.light.handler);
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
