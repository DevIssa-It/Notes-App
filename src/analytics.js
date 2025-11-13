/**
 * Analytics Module
 * Track and analyze user behavior and app usage
 */

class Analytics {
  constructor() {
    this.events = [];
    this.sessions = [];
    this.currentSession = null;
    this.maxEvents = 1000;
    this.init();
  }

  init() {
    this.startSession();
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.endSession();
      } else {
        this.startSession();
      }
    });

    // Track before unload
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  startSession() {
    this.currentSession = {
      id: this.generateSessionId(),
      startTime: new Date().toISOString(),
      endTime: null,
      events: 0,
      duration: 0,
    };
  }

  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = new Date().toISOString();
      this.currentSession.duration = 
        new Date(this.currentSession.endTime) - new Date(this.currentSession.startTime);
      
      this.sessions.push({ ...this.currentSession });
      
      // Keep only last 20 sessions
      if (this.sessions.length > 20) {
        this.sessions.shift();
      }
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEvent(eventName, eventData = {}) {
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession?.id,
    };

    this.events.push(event);
    
    if (this.currentSession) {
      this.currentSession.events += 1;
    }

    // Keep only last maxEvents
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  getEvents(eventName = null) {
    if (eventName) {
      return this.events.filter((e) => e.name === eventName);
    }
    return this.events;
  }

  getEventStats() {
    const stats = {};
    
    this.events.forEach((event) => {
      if (!stats[event.name]) {
        stats[event.name] = { count: 0, lastOccurred: null };
      }
      stats[event.name].count += 1;
      stats[event.name].lastOccurred = event.timestamp;
    });

    return stats;
  }

  getSessionStats() {
    const totalSessions = this.sessions.length;
    if (totalSessions === 0) return null;

    const avgDuration = this.sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions;
    const avgEvents = this.sessions.reduce((sum, s) => sum + s.events, 0) / totalSessions;

    return {
      totalSessions,
      avgDuration,
      avgEvents,
      sessions: this.sessions,
    };
  }

  getUserBehavior() {
    const stats = this.getEventStats();
    const sessionStats = this.getSessionStats();

    return {
      eventStats: stats,
      sessionStats,
      totalEvents: this.events.length,
      mostCommonEvent: this.getMostCommonEvent(),
      activityByHour: this.getActivityByHour(),
    };
  }

  getMostCommonEvent() {
    const stats = this.getEventStats();
    let maxCount = 0;
    let mostCommon = null;

    Object.keys(stats).forEach((eventName) => {
      if (stats[eventName].count > maxCount) {
        maxCount = stats[eventName].count;
        mostCommon = eventName;
      }
    });

    return { name: mostCommon, count: maxCount };
  }

  getActivityByHour() {
    const hourlyActivity = Array(24).fill(0);

    this.events.forEach((event) => {
      const hour = new Date(event.timestamp).getHours();
      hourlyActivity[hour] += 1;
    });

    return hourlyActivity;
  }

  exportAnalytics() {
    return {
      timestamp: new Date().toISOString(),
      events: this.events,
      sessions: this.sessions,
      stats: this.getUserBehavior(),
    };
  }

  clearAnalytics() {
    this.events = [];
    this.sessions = [];
    this.currentSession = null;
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;

// Convenience methods
export const trackEvent = (name, data) => analytics.trackEvent(name, data);
export const getAnalytics = () => analytics.exportAnalytics();
export const getUserBehavior = () => analytics.getUserBehavior();
