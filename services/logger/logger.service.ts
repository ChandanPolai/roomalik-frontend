// services/logger/logger.service.ts
import { logger } from 'react-native-logs';

// Define log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Configure logger with custom settings
const defaultConfig = {
  severity: __DEV__ ? 'debug' : 'error', // Show all logs in dev, only errors in production
  transport: (options: any) => {
    // Custom transport for better formatting
    const { msg, level, extension } = options;
    const timestamp = new Date().toISOString();
    const levelName = ['DEBUG', 'INFO', 'WARN', 'ERROR'][level] || 'UNKNOWN';
    
    // Color codes for different log levels
    const colors = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m',  // Green
      WARN: '\x1b[33m',  // Yellow
      ERROR: '\x1b[31m', // Red
      RESET: '\x1b[0m'   // Reset
    };

    const color = colors[levelName as keyof typeof colors] || colors.RESET;
    const reset = colors.RESET;
    
    // Format the log message
    let formattedMessage = `${color}[${timestamp}] ${levelName}${reset}: ${msg}`;
    
    // Add extension data if present
    if (extension && Object.keys(extension).length > 0) {
      formattedMessage += `\n${color}Data:${reset} ${JSON.stringify(extension, null, 2)}`;
    }
    
    // Output to console
    console.log(formattedMessage);
  },
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'cyanBright',
    },
  },
  dateFormat: 'time',
  printLevel: true,
  printDate: true,
  enabled: true,
};

// Create logger instance
const log = logger.createLogger(defaultConfig);

// Create specialized loggers for different modules
export const apiLogger = log.extend('API');
export const authLogger = log.extend('AUTH');
export const storageLogger = log.extend('STORAGE');
export const uiLogger = log.extend('UI');
export const navigationLogger = log.extend('NAVIGATION');

// Enhanced logging methods with better formatting
class LoggerService {
  private logger = log;

  // Debug logs - for detailed debugging information
  debug(message: string, data?: any, module?: string) {
    const logData = data ? { data, module } : { module };
    this.logger.debug(message, logData);
  }

  // Info logs - for general information
  info(message: string, data?: any, module?: string) {
    const logData = data ? { data, module } : { module };
    this.logger.info(message, logData);
  }

  // Warning logs - for potential issues
  warn(message: string, data?: any, module?: string) {
    const logData = data ? { data, module } : { module };
    this.logger.warn(message, logData);
  }

  // Error logs - for errors and exceptions
  error(message: string, error?: any, module?: string) {
    const logData = {
      error: error?.message || error,
      stack: error?.stack,
      module,
    };
    this.logger.error(message, logData);
  }

  // API specific logging
  apiRequest(method: string, url: string, data?: any, headers?: any) {
    apiLogger.info(`📤 ${method.toUpperCase()} ${url}`, {
      method: method.toUpperCase(),
      url,
      data,
      headers: headers ? Object.keys(headers) : undefined, // Don't log sensitive headers
    });
  }

  apiResponse(status: number, url: string, data?: any, duration?: number) {
    const emoji = status >= 200 && status < 300 ? '📥' : '❌';
    apiLogger.info(`${emoji} ${status} ${url}`, {
      status,
      url,
      data,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  apiError(error: any, url?: string, method?: string) {
    apiLogger.error(`❌ API Error: ${error.message || 'Unknown error'}`, {
      error: error.message,
      status: error.response?.status,
      url,
      method,
      data: error.response?.data,
    });
  }

  // Authentication specific logging
  authAction(action: string, data?: any) {
    authLogger.info(`🔐 ${action}`, { action, data });
  }

  authError(error: any, action?: string) {
    authLogger.error(`🔐 Auth Error: ${error.message || 'Unknown error'}`, {
      error: error.message,
      action,
    });
  }

  // Storage specific logging
  storageAction(action: string, key?: string, data?: any) {
    storageLogger.debug(`💾 ${action}`, { action, key, dataSize: data ? JSON.stringify(data).length : 0 });
  }

  storageError(error: any, action?: string, key?: string) {
    storageLogger.error(`💾 Storage Error: ${error.message || 'Unknown error'}`, {
      error: error.message,
      action,
      key,
    });
  }

  // UI specific logging
  uiAction(action: string, component?: string, data?: any) {
    uiLogger.debug(`🎨 ${action}`, { action, component, data });
  }

  uiError(error: any, component?: string, action?: string) {
    uiLogger.error(`🎨 UI Error: ${error.message || 'Unknown error'}`, {
      error: error.message,
      component,
      action,
    });
  }

  // Navigation specific logging
  navigationAction(action: string, route?: string, params?: any) {
    navigationLogger.debug(`🧭 ${action}`, { action, route, params });
  }

  navigationError(error: any, action?: string, route?: string) {
    navigationLogger.error(`🧭 Navigation Error: ${error.message || 'Unknown error'}`, {
      error: error.message,
      action,
      route,
    });
  }

  // Performance logging
  performance(operation: string, duration: number, data?: any) {
    const emoji = duration > 1000 ? '🐌' : duration > 500 ? '⏱️' : '⚡';
    this.logger.info(`${emoji} Performance: ${operation} took ${duration}ms`, {
      operation,
      duration,
      data,
    });
  }

  // User action logging
  userAction(action: string, data?: any) {
    this.logger.info(`👤 User Action: ${action}`, { action, data });
  }

  // Network status logging
  networkStatus(status: string, details?: any) {
    this.logger.info(`🌐 Network: ${status}`, { status, details });
  }
}

// Export singleton instance
export default new LoggerService();
