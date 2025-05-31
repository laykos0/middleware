import Logger, {LogLevel} from "../logger";

export class MockLogger extends Logger {
    log(level: LogLevel, ...args: any[]) {}
    debug(level: LogLevel, ...args: any[]) {}
    info(level: LogLevel, ...args: any[]) {}
    warn(level: LogLevel, ...args: any[]) {}
    error(level: LogLevel, ...args: any[]) {}
}