'use strict';

const config = require('../config');

/**
 * Log levels
 */
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * ANSI color codes for pretty printing
 */
const COLORS = {
  debug: '\x1b[36m', // Cyan
  info: '\x1b[32m',  // Green
  warn: '\x1b[33m',  // Yellow
  error: '\x1b[31m', // Red
  reset: '\x1b[0m',
};

/**
 * Simple logger utility
 */
class Logger {
  constructor() {
    this.level = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info;
    this.format = config.logFormat;
  }

  /**
   * Format log entry
   */
  _format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();

    if (this.format === 'json') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    }

    // Pretty format
    const color = COLORS[level] || COLORS.reset;
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${color}[${timestamp}] ${level.toUpperCase()}:${COLORS.reset} ${message}${metaStr}`;
  }

  /**
   * Log a message
   */
  _log(level, message, meta = {}) {
    if (LOG_LEVELS[level] >= this.level) {
      const formatted = this._format(level, message, meta);
      console.log(formatted);
    }
  }

  debug(message, meta) {
    this._log('debug', message, meta);
  }

  info(message, meta) {
    this._log('info', message, meta);
  }

  warn(message, meta) {
    this._log('warn', message, meta);
  }

  error(message, meta) {
    this._log('error', message, meta);
  }
}

module.exports = new Logger();
