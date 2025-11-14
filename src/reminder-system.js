/**
 * Reminder System
 * Set reminders for notes
 */

class ReminderSystem {
  constructor() {
    this.reminders = this.loadReminders();
    this.checkReminders();
  }

  loadReminders() {
    try {
      const saved = localStorage.getItem('note-reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveReminders() {
    try {
      localStorage.setItem('note-reminders', JSON.stringify(this.reminders));
    } catch {
      // Silent error
    }
  }

  setReminder(noteId, reminderTime, title) {
    const reminder = {
      id: this.generateId(),
      noteId,
      title,
      reminderTime: new Date(reminderTime).toISOString(),
      createdAt: new Date().toISOString(),
      triggered: false,
    };

    this.reminders.push(reminder);
    this.saveReminders();
    return reminder;
  }

  removeReminder(reminderId) {
    const index = this.reminders.findIndex((r) => r.id === reminderId);
    if (index > -1) {
      this.reminders.splice(index, 1);
      this.saveReminders();
      return true;
    }
    return false;
  }

  checkReminders() {
    setInterval(() => {
      const now = new Date();
      this.reminders.forEach((reminder) => {
        if (!reminder.triggered && new Date(reminder.reminderTime) <= now) {
          this.triggerReminder(reminder);
        }
      });
    }, 60000); // Check every minute
  }

  triggerReminder(reminder) {
    reminder.triggered = true;
    this.saveReminders();

    if ('Notification' in window && Notification.permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification('Note Reminder', {
        body: reminder.title,
        icon: '/icon-192.png',
      });
    }

    document.dispatchEvent(new CustomEvent('reminder-triggered', {
      detail: reminder,
    }));
  }

  getReminders(noteId = null) {
    if (noteId) {
      return this.reminders.filter((r) => r.noteId === noteId);
    }
    return this.reminders;
  }

  generateId() {
    return `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new ReminderSystem();
