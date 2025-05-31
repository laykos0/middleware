export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const colors: Record<LogLevel, string> = {
    debug: '\x1b[36m',
    info: '\x1b[32m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
};

const reset = '\x1b[0m';

const Logger: Record<LogLevel, (...args: any[]) => void> = {
    debug: (...args) => log('debug', ...args),
    info: (...args) => log('info', ...args),
    warn: (...args) => log('warn', ...args),
    error: (...args) => log('error', ...args),
};

function log(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const color = colors[level];
    const tag = `[${level.toUpperCase()}]`;
    console.log(`${color}[${timestamp}] ${tag}${reset}`, ...args);
}

export default Logger;