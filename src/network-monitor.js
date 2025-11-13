/**
 * Network Status Monitor
 * Track online/offline status and connection quality
 */

class NetworkMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connectionType = this.getConnectionType();
    this.listeners = new Set();
    this.init();
  }

  init() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => this.handleConnectionChange());
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.connectionType = this.getConnectionType();
    this.notify({ type: 'online', connection: this.connectionType });
  }

  handleOffline() {
    this.isOnline = false;
    this.notify({ type: 'offline' });
  }

  handleConnectionChange() {
    this.connectionType = this.getConnectionType();
    this.notify({ type: 'connection-change', connection: this.connectionType });
  }

  getConnectionType() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      };
    }
    return null;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(event) {
    this.listeners.forEach((callback) => callback(event));
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      connectionType: this.connectionType,
    };
  }
}

export default new NetworkMonitor();
