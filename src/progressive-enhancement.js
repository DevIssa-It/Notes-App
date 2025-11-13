/**
 * Progressive Enhancement
 * Enhances app with advanced features when supported
 */

class ProgressiveEnhancement {
  constructor() {
    this.features = {
      serviceWorker: false,
      notifications: false,
      indexedDB: false,
      webShare: false,
      clipboardAPI: false,
      fileSystemAccess: false,
      webAnimations: false,
      intersectionObserver: false,
    };
    this.init();
  }

  init() {
    this.detectFeatures();
    this.applyEnhancements();
  }

  detectFeatures() {
    // Service Worker
    this.features.serviceWorker = 'serviceWorker' in navigator;

    // Notifications
    this.features.notifications = 'Notification' in window;

    // IndexedDB
    this.features.indexedDB = 'indexedDB' in window;

    // Web Share API
    this.features.webShare = 'share' in navigator;

    // Clipboard API
    this.features.clipboardAPI = 'clipboard' in navigator;

    // File System Access API
    this.features.fileSystemAccess = 'showOpenFilePicker' in window;

    // Web Animations API
    this.features.webAnimations = 'animate' in Element.prototype;

    // Intersection Observer
    this.features.intersectionObserver = 'IntersectionObserver' in window;
  }

  applyEnhancements() {
    // Apply enhanced features if available
    if (this.features.webShare) {
      this.enableWebShare();
    }

    if (this.features.clipboardAPI) {
      this.enableAdvancedClipboard();
    }

    if (this.features.intersectionObserver) {
      this.enableLazyLoading();
    }

    if (this.features.webAnimations) {
      this.enableSmoothAnimations();
    }
  }

  enableWebShare() {
    // Add share buttons functionality
    document.addEventListener('share-note', (e) => {
      const { title, body } = e.detail;
      
      if (navigator.share) {
        navigator.share({
          title,
          text: body,
          url: window.location.href,
        }).catch(() => {
          // Silent error - fallback handled elsewhere
        });
      }
    });
  }

  enableAdvancedClipboard() {
    // Enhanced clipboard operations
    document.addEventListener('copy-note', async (e) => {
      const { text } = e.detail;
      
      try {
        await navigator.clipboard.writeText(text);
        this.dispatchSuccess('Copied to clipboard');
      } catch {
        // Fallback to traditional copy
        this.fallbackCopy(text);
      }
    });
  }

  enableLazyLoading() {
    // Lazy load images and components
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px',
    });

    // Observe lazy-loadable elements
    document.querySelectorAll('[data-src]').forEach((el) => {
      observer.observe(el);
    });
  }

  enableSmoothAnimations() {
    // Add smooth animations to elements
    document.addEventListener('animate-element', (e) => {
      const { element, keyframes, options } = e.detail;
      
      if (element && element.animate) {
        element.animate(keyframes, options);
      }
    });
  }

  fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      this.dispatchSuccess('Copied to clipboard');
    } catch {
      // Silent error
    }
    
    document.body.removeChild(textarea);
  }

  dispatchSuccess(message) {
    document.body.dispatchEvent(new CustomEvent('show-toast', {
      detail: { type: 'success', message },
      bubbles: true,
      composed: true,
    }));
  }

  async requestNotificationPermission() {
    if (!this.features.notifications) return false;

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async showNotification(title, options = {}) {
    if (!this.features.notifications) return;

    const hasPermission = await this.requestNotificationPermission();
    
    if (hasPermission) {
      // eslint-disable-next-line no-new
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
  }

  getFeatureSupport() {
    return { ...this.features };
  }

  isFeatureSupported(feature) {
    return this.features[feature] || false;
  }

  getSupportedFeatures() {
    return Object.keys(this.features).filter((key) => this.features[key]);
  }

  getUnsupportedFeatures() {
    return Object.keys(this.features).filter((key) => !this.features[key]);
  }

  getCompatibilityScore() {
    const supported = this.getSupportedFeatures().length;
    const total = Object.keys(this.features).length;
    return Math.round((supported / total) * 100);
  }

  generateCompatibilityReport() {
    return {
      score: this.getCompatibilityScore(),
      supported: this.getSupportedFeatures(),
      unsupported: this.getUnsupportedFeatures(),
      features: this.features,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    };
  }
}

// Create singleton instance
const progressiveEnhancement = new ProgressiveEnhancement();

export default progressiveEnhancement;

// Export convenience methods
export const isFeatureSupported = (feature) => progressiveEnhancement.isFeatureSupported(feature);
export const getCompatibilityScore = () => progressiveEnhancement.getCompatibilityScore();
export const showNotification = (title, options) => (
  progressiveEnhancement.showNotification(title, options)
);
export const getCompatibilityReport = () => progressiveEnhancement.generateCompatibilityReport();
