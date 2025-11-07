/**
 * UI Helper Functions
 * Centralized UI operations for better maintainability
 */

import Swal from 'sweetalert2';
import { COLORS, TIMING } from './constants.js';

/**
 * Get current theme colors for SweetAlert
 * @returns {Object} Theme colors {background, color}
 */
export function getSwalTheme() {
  const isLight =
    document.documentElement.getAttribute('data-theme') === 'light';
  return {
    background: isLight
      ? COLORS.THEME.LIGHT.BACKGROUND
      : COLORS.THEME.DARK.BACKGROUND,
    color: isLight ? COLORS.THEME.LIGHT.TEXT : COLORS.THEME.DARK.TEXT,
  };
}

/**
 * Show error message using SweetAlert
 * @param {string} message - Error message to display
 * @param {Error} error - Error object
 */
export function showError(message, error) {
  // eslint-disable-next-line no-console
  console.error(message, error);
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
    footer: error ? `<small>${error.message}</small>` : '',
    confirmButtonColor: COLORS.PRIMARY,
    background: theme.background,
    color: theme.color,
  });
}

/**
 * Show success message using SweetAlert
 * @param {string} message - Success message to display
 */
export function showSuccess(message) {
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: TIMING.SUCCESS_TOAST,
    showConfirmButton: false,
    background: theme.background,
    color: theme.color,
  });
}

/**
 * Show success message with undo action
 * @param {string} message - Success message to display
 * @param {Function} undoCallback - Callback function for undo action
 */
export function showSuccessWithUndo(message, undoCallback) {
  const theme = getSwalTheme();
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    timer: TIMING.UNDO_TIMEOUT,
    showConfirmButton: true,
    confirmButtonText: '<i class="fas fa-undo"></i> Undo',
    confirmButtonColor: COLORS.PRIMARY,
    background: theme.background,
    color: theme.color,
  }).then((result) => {
    if (result.isConfirmed && undoCallback) {
      undoCallback();
    }
  });
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} text - Dialog text
 * @param {string} confirmText - Confirm button text
 * @returns {Promise<boolean>} True if confirmed, false otherwise
 */
export async function showConfirm(title, text, confirmText = 'Yes') {
  const theme = getSwalTheme();
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: COLORS.DANGER,
    cancelButtonColor: COLORS.SECONDARY,
    confirmButtonText: confirmText,
    background: theme.background,
    color: theme.color,
  });
  return result.isConfirmed;
}

/**
 * Loading indicator manager
 */
export class LoadingManager {
  constructor() {
    this.indicator = null;
  }

  /**
   * Get loading indicator element
   * @returns {HTMLElement|null} Loading indicator element
   */
  getIndicator() {
    if (!this.indicator) {
      this.indicator = document.querySelector('loading-indicator');
    }
    return this.indicator;
  }

  /**
   * Show loading indicator
   * @param {string} message - Loading message
   * @param {string} submessage - Loading submessage
   */
  show(message = 'Loading...', submessage = 'Please wait') {
    const indicator = this.getIndicator();
    if (indicator) {
      indicator.show(message, submessage);
    }
  }

  /**
   * Hide loading indicator
   */
  hide() {
    const indicator = this.getIndicator();
    if (indicator) {
      indicator.hide();
    }
  }
}

/**
 * DOM helper functions
 */
export const DOM = {
  /**
   * Get element by selector
   * @param {string} selector - CSS selector
   * @returns {HTMLElement|null} Element or null
   */
  get(selector) {
    return document.querySelector(selector);
  },

  /**
   * Get all elements by selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} NodeList of elements
   */
  getAll(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Set text content safely
   * @param {string} selector - CSS selector
   * @param {string} text - Text to set
   */
  setText(selector, text) {
    const element = this.get(selector);
    if (element) {
      element.textContent = text;
    }
  },

  /**
   * Toggle element visibility
   * @param {string} selector - CSS selector
   * @param {boolean} show - Show or hide
   */
  toggleDisplay(selector, show) {
    const element = this.get(selector);
    if (element) {
      // eslint-disable-next-line no-param-reassign
      element.style.display = show ? 'block' : 'none';
    }
  },
};
