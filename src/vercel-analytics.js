/**
 * Vercel Analytics Integration
 * Track page views and user interactions
 */

import { inject } from '@vercel/analytics';

class VercelAnalytics {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    try {
      // Inject Vercel Analytics
      inject();
      this.initialized = true;
    } catch (error) {
      // Silent error
    }
  }

  trackEvent(eventName, properties = {}) {
    if (!this.initialized) return;

    try {
      // Custom event tracking
      if (window.va) {
        window.va('event', eventName, properties);
      }
    } catch {
      // Silent error
    }
  }

  // Track specific note app events
  trackNoteCreated() {
    this.trackEvent('note_created', {
      category: 'notes',
      action: 'create',
    });
  }

  trackNoteArchived() {
    this.trackEvent('note_archived', {
      category: 'notes',
      action: 'archive',
    });
  }

  trackNoteDeleted() {
    this.trackEvent('note_deleted', {
      category: 'notes',
      action: 'delete',
    });
  }

  trackSearch(query) {
    this.trackEvent('search', {
      category: 'search',
      query: query.length > 0 ? 'has_query' : 'empty',
    });
  }

  trackExport(format) {
    this.trackEvent('export', {
      category: 'export',
      format,
    });
  }

  trackThemeToggle(theme) {
    this.trackEvent('theme_toggle', {
      category: 'settings',
      theme,
    });
  }
}

export default new VercelAnalytics();
