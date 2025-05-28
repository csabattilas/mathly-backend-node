import { Request, Response, NextFunction } from 'express'

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LoggerConfig {
  level: LogLevel;
  includeTimestamp: boolean;
  colorize: boolean;
}

const defaultConfig: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  includeTimestamp: true,
  colorize: process.env.NODE_ENV !== 'production',
}

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
}

export class Logger {
  private config: LoggerConfig;
  private context?: string;

  constructor(config: Partial<LoggerConfig> = {}, context?: string) {
    this.config = { ...defaultConfig, ...config };
    this.context = context;
  }

  static forContext(context: string, config: Partial<LoggerConfig> = {}): Logger {
    return new Logger(config, context);
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    let formattedMessage = this.formatMessage(level, message);
    
    if (this.context) {
      formattedMessage = `[${this.context}] ${formattedMessage}`;
    }

    if (this.config.includeTimestamp) {
      const timestamp = new Date().toISOString();
      formattedMessage = `${timestamp} ${formattedMessage}`;
    }

    if (this.config.colorize) {
      formattedMessage = this.colorize(level, formattedMessage);
    }

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, meta ? meta : '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, meta ? meta : '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, meta ? meta : '');
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, meta ? meta : '');
        break;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const configLevelIndex = levels.indexOf(this.config.level);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex <= configLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string): string {
    return `[${level}] ${message}`;
  }

  private colorize(level: LogLevel, message: string): string {
    switch (level) {
      case LogLevel.ERROR:
        return `${colors.red}${message}${colors.reset}`;
      case LogLevel.WARN:
        return `${colors.yellow}${message}${colors.reset}`;
      case LogLevel.INFO:
        return `${colors.blue}${message}${colors.reset}`;
      case LogLevel.DEBUG:
        return `${colors.gray}${message}${colors.reset}`;
      default:
        return message;
    }
  }
}

export const logger = new Logger();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl, ip } = req;
  
  logger.info(`${method} ${originalUrl} - ${ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    if (statusCode >= 500) {
      logger.error(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    } else if (statusCode >= 400) {
      logger.warn(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    } else {
      logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
    }
  });
  
  next();
};
