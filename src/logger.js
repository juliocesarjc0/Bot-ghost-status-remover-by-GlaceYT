/**
 * Logger Module
 * Provides centralized logging functionality with different log levels
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
};

/**
 * Formats timestamp for log messages
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Logger class for structured logging
 */
class Logger {
  constructor(context = 'App') {
    this.context = context;
  }

  /**
   * Logs an error message
   * @param {string} message - The message to log
   * @param {Error} [error] - Optional error object
   */
  error(message, error = null) {
    console.error(
      `${COLORS.red}[${getTimestamp()}] [${this.context}] ERROR: ${message}${COLORS.reset}`
    );
    if (error && error.stack) {
      console.error(`${COLORS.red}${error.stack}${COLORS.reset}`);
    }
  }

  /**
   * Logs a warning message
   * @param {string} message - The message to log
   */
  warn(message) {
    console.warn(
      `${COLORS.yellow}[${getTimestamp()}] [${this.context}] WARN: ${message}${COLORS.reset}`
    );
  }

  /**
   * Logs an info message
   * @param {string} message - The message to log
   */
  info(message) {
    console.log(
      `${COLORS.blue}[${getTimestamp()}] [${this.context}] INFO: ${message}${COLORS.reset}`
    );
  }

  /**
   * Logs a success message
   * @param {string} message - The message to log
   */
  success(message) {
    console.log(
      `${COLORS.green}[${getTimestamp()}] [${this.context}] ✓ ${message}${COLORS.reset}`
    );
  }

  /**
   * Logs a debug message (only in development)
   * @param {string} message - The message to log
   */
  debug(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `${COLORS.magenta}[${getTimestamp()}] [${this.context}] DEBUG: ${message}${COLORS.reset}`
      );
    }
  }
}

/**
 * Creates a new logger instance with a specific context
 * @param {string} context - The context name for the logger
 * @returns {Logger} Logger instance
 */
function createLogger(context) {
  return new Logger(context);
}

module.exports = { Logger, createLogger, LOG_LEVELS };
