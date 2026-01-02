import * as FileSystem from 'expo-file-system';
import { DatabaseError } from './ShipmentDatabase';

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  service: string;
  operation: string;
  message: string;
  details?: any;
  userAgent?: string;
  deviceInfo?: {
    platform: string;
    version: string;
  };
}

export interface ErrorRecoveryStrategy {
  canRecover: boolean;
  recoveryAction?: () => Promise<void>;
  userMessage: string;
  technicalDetails?: string;
}

class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private readonly ERROR_LOG_FILE = 'app-data/error-logs.json';
  private readonly MAX_LOG_ENTRIES = 1000;
  private errorLogs: ErrorLog[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Initialize error handling service
   */
  public async initialize(): Promise<void> {
    try {
      await this.loadErrorLogs();
    } catch (error) {
      console.warn('Failed to initialize error handling service:', error);
    }
  }

  /**
   * Log an error with context information
   */
  public async logError(
    service: string,
    operation: string,
    error: any,
    level: 'error' | 'warning' | 'info' = 'error'
  ): Promise<void> {
    const errorLog: ErrorLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      service,
      operation,
      message: error instanceof Error ? error.message : String(error),
      details: this.sanitizeErrorDetails(error),
      deviceInfo: {
        platform: 'react-native',
        version: '1.0.0', // Could be retrieved from app info
      },
    };

    this.errorLogs.unshift(errorLog);
    
    // Keep only recent entries
    if (this.errorLogs.length > this.MAX_LOG_ENTRIES) {
      this.errorLogs = this.errorLogs.slice(0, this.MAX_LOG_ENTRIES);
    }

    // Persist to file (async, don't wait)
    this.saveErrorLogsToFile().catch(err => 
      console.warn('Failed to save error logs:', err)
    );

    // Console logging for development
    const logMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
    logMethod(`[${service}:${operation}] ${errorLog.message}`, errorLog.details);
  }

  /**
   * Get error recovery strategy based on error type
   */
  public getRecoveryStrategy(error: any, service: string, operation: string): ErrorRecoveryStrategy {
    // Database-specific error recovery
    if (service === 'ShipmentDatabase') {
      return this.getDatabaseErrorRecovery(error, operation);
    }

    // File system error recovery
    if (this.isFileSystemError(error)) {
      return this.getFileSystemErrorRecovery(error);
    }

    // Network/connectivity error recovery
    if (this.isConnectivityError(error)) {
      return this.getConnectivityErrorRecovery(error);
    }

    // Generic error recovery
    return {
      canRecover: false,
      userMessage: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
      technicalDetails: error instanceof Error ? error.message : String(error),
    };
  }

  /**
   * Attempt automatic error recovery
   */
  public async attemptRecovery(error: any, service: string, operation: string): Promise<boolean> {
    const strategy = this.getRecoveryStrategy(error, service, operation);
    
    if (strategy.canRecover && strategy.recoveryAction) {
      try {
        await strategy.recoveryAction();
        await this.logError(service, operation, `Recovery successful for: ${error}`, 'info');
        return true;
      } catch (recoveryError) {
        await this.logError(service, `${operation}-recovery`, recoveryError, 'error');
        return false;
      }
    }
    
    return false;
  }

  /**
   * Get recent error logs
   */
  public getRecentErrors(count: number = 50): ErrorLog[] {
    return this.errorLogs.slice(0, count);
  }

  /**
   * Get errors by service
   */
  public getErrorsByService(service: string, count: number = 50): ErrorLog[] {
    return this.errorLogs
      .filter(log => log.service === service)
      .slice(0, count);
  }

  /**
   * Clear error logs
   */
  public async clearErrorLogs(): Promise<void> {
    this.errorLogs = [];
    await this.saveErrorLogsToFile();
  }

  /**
   * Export error logs for debugging
   */
  public async exportErrorLogs(): Promise<string> {
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      version: '1.0.0',
      totalEntries: this.errorLogs.length,
      logs: this.errorLogs,
    };

    const exportPath = FileSystem.documentDirectory + `app-data/error-export-${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(exportPath, JSON.stringify(exportData, null, 2));
    
    return exportPath;
  }

  // Private helper methods

  private async loadErrorLogs(): Promise<void> {
    try {
      const logPath = FileSystem.documentDirectory + this.ERROR_LOG_FILE;
      const fileInfo = await FileSystem.getInfoAsync(logPath);
      
      if (fileInfo.exists) {
        const logContent = await FileSystem.readAsStringAsync(logPath);
        const parsedLogs = JSON.parse(logContent);
        this.errorLogs = Array.isArray(parsedLogs) ? parsedLogs : [];
      }
    } catch (error) {
      console.warn('Failed to load error logs:', error);
      this.errorLogs = [];
    }
  }

  private async saveErrorLogsToFile(): Promise<void> {
    try {
      // Ensure directory exists
      const logDir = FileSystem.documentDirectory + 'app-data/';
      const dirInfo = await FileSystem.getInfoAsync(logDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(logDir, { intermediates: true });
      }

      const logPath = FileSystem.documentDirectory + this.ERROR_LOG_FILE;
      await FileSystem.writeAsStringAsync(logPath, JSON.stringify(this.errorLogs, null, 2));
    } catch (error) {
      console.warn('Failed to save error logs to file:', error);
    }
  }

  private sanitizeErrorDetails(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (typeof error === 'object' && error !== null) {
      // Remove potentially sensitive data
      const sanitized = { ...error };
      delete sanitized.password;
      delete sanitized.token;
      delete sanitized.apiKey;
      return sanitized;
    }

    return error;
  }

  private getDatabaseErrorRecovery(error: DatabaseError | any, operation: string): ErrorRecoveryStrategy {
    const errorCode = error?.code || 'UNKNOWN';

    switch (errorCode) {
      case 'INIT_FAILED':
        return {
          canRecover: true,
          recoveryAction: async () => {
            const ShipmentDatabase = await import('./ShipmentDatabase');
            await ShipmentDatabase.default.initialize();
          },
          userMessage: 'Database initialization failed. Attempting to reinitialize...',
          technicalDetails: error.message,
        };

      case 'SAVE_FAILED':
        return {
          canRecover: true,
          recoveryAction: async () => {
            // Could implement retry logic or backup save location
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait and retry
          },
          userMessage: 'Failed to save shipment. Retrying...',
          technicalDetails: error.message,
        };

      case 'LOAD_FAILED':
        return {
          canRecover: false,
          userMessage: 'Failed to load shipment data. The file may be corrupted or missing.',
          technicalDetails: error.message,
        };

      default:
        return {
          canRecover: false,
          userMessage: 'A database error occurred. Please try again.',
          technicalDetails: error.message || String(error),
        };
    }
  }

  private getFileSystemErrorRecovery(error: any): ErrorRecoveryStrategy {
    return {
      canRecover: true,
      recoveryAction: async () => {
        // Attempt to recreate directories or clean up corrupted files
        const ShipmentDatabase = await import('./ShipmentDatabase');
        await ShipmentDatabase.default.initialize();
      },
      userMessage: 'File system error detected. Attempting to repair...',
      technicalDetails: error.message || String(error),
    };
  }

  private getConnectivityErrorRecovery(error: any): ErrorRecoveryStrategy {
    return {
      canRecover: false,
      userMessage: 'Network connectivity issue. Please check your internet connection.',
      technicalDetails: error.message || String(error),
    };
  }

  private isFileSystemError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    return message.includes('file') || 
           message.includes('directory') || 
           message.includes('permission') ||
           message.includes('disk');
  }

  private isConnectivityError(error: any): boolean {
    const message = error?.message?.toLowerCase() || '';
    return message.includes('network') || 
           message.includes('connection') || 
           message.includes('timeout') ||
           message.includes('offline');
  }
}

export default ErrorHandlingService.getInstance();