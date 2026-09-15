// Error logging service
// Captures errors and sends to backend for monitoring

interface LogEntry {
  level: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stackTrace?: string;
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  logError(message: string, error?: Error, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      stackTrace: error?.stack,
    };

    this.addLog(entry);
    console.error(message, error, context);

    // TODO: Send to backend API for persistent storage
    // await this.sendLogsToBackend([entry]);
  }

  logWarning(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'warning',
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    this.addLog(entry);
    console.warn(message, context);
  }

  logInfo(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    this.addLog(entry);
    console.log(message, context);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  private async sendLogsToBackend(logs: LogEntry[]): Promise<void> {
    try {
      // TODO: Implement backend API call
      // await axios.post('/api/logs', { entries: logs });
      console.log('Would send logs to backend:', logs);
    } catch (error) {
      console.error('Failed to send logs to backend:', error);
    }
  }
}

export const logService = new LogService();
