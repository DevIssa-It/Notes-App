/**
 * Notification Manager
 * Handle in-app and browser notifications
 */

class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.checkPermission();
  }

  async checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission() {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    }
    return false;
  }

  async show(title, options = {}) {
    if (this.permission === 'granted') {
      return new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        ...options,
      });
    }
    
    return this.showInApp(title, options.body);
  }

  showInApp(title, message) {
    const event = new CustomEvent('show-notification', {
      detail: { title, message, type: 'info' },
    });
    document.dispatchEvent(event);
    return { title, message };
  }

  showSuccess(message) {
    return this.showInApp('Success', message);
  }

  showError(message) {
    return this.showInApp('Error', message);
  }

  showWarning(message) {
    return this.showInApp('Warning', message);
  }
}

export default new NotificationManager();
