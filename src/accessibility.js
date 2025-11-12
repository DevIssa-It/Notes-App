/**
 * Accessibility Utilities for Notes App
 * Provides helpers for keyboard navigation, focus management, and ARIA attributes
 */

/**
 * Focus Trap - Keeps focus within a modal or dialog
 * @param {HTMLElement} element - Container element to trap focus within
 * @returns {Object} Object with enable/disable methods
 */
export function createFocusTrap(element) {
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusable;
  let lastFocusable;
  let isActive = false;

  const handleKeyDown = (e) => {
    if (!isActive || e.key !== 'Tab') return;

    const focusableElements = element.querySelectorAll(focusableSelectors);
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  };

  return {
    enable() {
      isActive = true;
      const focusableElements = element.querySelectorAll(focusableSelectors);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      document.addEventListener('keydown', handleKeyDown);
    },
    disable() {
      isActive = false;
      document.removeEventListener('keydown', handleKeyDown);
    },
  };
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Add skip link functionality
 * @param {string} targetId - ID of main content to skip to
 */
export function addSkipLink(targetId = 'main-content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #7c3aed;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Enhance button accessibility
 * @param {HTMLElement} button - Button element
 * @param {string} label - Accessible label
 * @param {string} description - Additional description
 */
export function enhanceButtonAccessibility(button, label, description = '') {
  button.setAttribute('aria-label', label);
  if (description) {
    button.setAttribute('aria-description', description);
  }
}

/**
 * Manage modal accessibility
 * @param {HTMLElement} modal - Modal element
 * @param {boolean} isOpen - Whether modal is open
 */
export function manageModalAccessibility(modal, isOpen) {
  if (isOpen) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
  } else {
    modal.removeAttribute('role');
    modal.removeAttribute('aria-modal');
    document.body.style.overflow = '';
  }
}
