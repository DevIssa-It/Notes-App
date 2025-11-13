/**
 * Error Boundary Handler
 * Catches and handles global errors gracefully
 */

import { showError } from './ui-helpers.js';

class ErrorBoundary {
  constructor() {
    this.errors = [];
    this.maxErrors = 20;
    this.init();
  }

  init() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
        type: 'runtime',
        timestamp: new Date().toISOString(),
      });
      
      // Prevent default browser error handling
      event.preventDefault();
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || String(event.reason),
        error: event.reason,
        type: 'promise',
        timestamp: new Date().toISOString(),
      });
      
      event.preventDefault();
    });
  }

  handleError(errorData) {
    // Store error
    this.errors.push(errorData);
    
    // Keep only last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught:', errorData);
    }

    // Show user-friendly error message
    const userMessage = this.getUserMessage(errorData);
    showError('An error occurred', new Error(userMessage));

    // Optionally send to error tracking service
    this.reportError(errorData);
  }

  getUserMessage(errorData) {
    const { type, message } = errorData;
    
    if (type === 'promise') {
      return 'An operation failed. Please try again.';
    }
    
    if (message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    
    if (message.includes('API')) {
      return 'Server error. Please try again later.';
    }
    
    return 'Something went wrong. Please refresh the page.';
  }

  reportError() {
    // In production, send to error tracking service
    // Example: Sentry, LogRocket, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   Send to tracking service
    // }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorStats() {
    const types = this.errors.reduce((acc, err) => {
      acc[err.type] = (acc[err.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: this.errors.length,
      byType: types,
      latest: this.errors[this.errors.length - 1],
    };
  }
}

// Create singleton instance
const errorBoundary = new ErrorBoundary();

export default errorBoundary;
