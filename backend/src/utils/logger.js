/**
 * Logger utility for backend operations
 * Provides structured logging for debugging and monitoring
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL || 'INFO';

/**
 * Formats log message with timestamp and metadata
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} metadata - Additional metadata
 * @returns {string} - Formatted log message
 */
function formatLogMessage(level, message, metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...metadata,
  };

  return JSON.stringify(logEntry);
}

/**
 * Checks if message should be logged based on current log level
 * @param {string} level - Log level to check
 * @returns {boolean} - Whether to log the message
 */
function shouldLog(level) {
  const currentLevel = LOG_LEVELS[CURRENT_LOG_LEVEL] || LOG_LEVELS.INFO;
  const messageLevel = LOG_LEVELS[level] || LOG_LEVELS.INFO;
  return messageLevel <= currentLevel;
}

/**
 * Logs error messages
 * @param {string} message - Error message
 * @param {Object} metadata - Additional error metadata
 */
export function error(message, metadata = {}) {
  if (shouldLog('ERROR')) {
    console.error(formatLogMessage('ERROR', message, metadata));
  }
}

/**
 * Logs warning messages
 * @param {string} message - Warning message
 * @param {Object} metadata - Additional warning metadata
 */
export function warn(message, metadata = {}) {
  if (shouldLog('WARN')) {
    console.warn(formatLogMessage('WARN', message, metadata));
  }
}

/**
 * Logs info messages
 * @param {string} message - Info message
 * @param {Object} metadata - Additional info metadata
 */
export function info(message, metadata = {}) {
  if (shouldLog('INFO')) {
    console.log(formatLogMessage('INFO', message, metadata));
  }
}

/**
 * Logs debug messages
 * @param {string} message - Debug message
 * @param {Object} metadata - Additional debug metadata
 */
export function debug(message, metadata = {}) {
  if (shouldLog('DEBUG')) {
    console.log(formatLogMessage('DEBUG', message, metadata));
  }
}

/**
 * Logger object with all methods
 */
export const logger = {
  error,
  warn,
  info,
  debug,
};

export default logger;
