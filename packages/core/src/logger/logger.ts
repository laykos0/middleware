const RESET = '\x1b[0m';
const COLORS: Record<LogLevel, string> = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
};

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export class Logger {
    private static logLevelOrder: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    };

    constructor(private currentLogLevel: LogLevel = 'info') {}

    private shouldLog(level: LogLevel): boolean {
        return Logger.logLevelOrder[level] >= Logger.logLevelOrder[this.currentLogLevel];
    }

    log(level: LogLevel, ...args: any[]) {
        if (!this.shouldLog(level)) return;
        const timestamp = new Date().toISOString();
        const color = COLORS[level];
        const tag = `[${level.toUpperCase()}]`;
        console.log(`${color}[${timestamp}] ${tag}${RESET}`, ...args);
    }

    debug(...args: any[]) { this.log('debug', ...args); }
    info(...args: any[]) { this.log('info', ...args); }
    warn(...args: any[]) { this.log('warn', ...args); }
    error(...args: any[]) { this.log('error', ...args); }
}