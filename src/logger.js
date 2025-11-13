/**
 * Logger Utility
 * Development and production logging
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor() {
    this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
    this.logs = [];
    this.maxLogs = 500;
  }

  debug(message, ...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, ...args);
      this.storeLog('DEBUG', message, args);
    }
  }

  info(message, ...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, ...args);
      this.storeLog('INFO', message, args);
    }
  }

  warn(message, ...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, ...args);
      this.storeLog('WARN', message, args);
    }
  }

  error(message, ...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, ...args);
      this.storeLog('ERROR', message, args);
    }
  }

  storeLog(level, message, args) {
    this.logs.push({
      level,
      message,
      args,
      timestamp: new Date().toISOString(),
    });

    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  getLogs(level = null) {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      logs: this.logs,
    };
  }
}

export default new Logger();
