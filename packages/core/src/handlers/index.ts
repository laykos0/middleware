export * from './proto.handler'
export * from './sql-inject.handler'
export * from './path-traversal.handler'
export * from './xss.handler'

import {ProtoHandlerOptions} from './proto.handler'
import {XSSHandlerOptions} from './xss.handler'
import {PathTraversalHandlerOptions} from './path-traversal.handler'

export interface DefaultHandlerOptions {
    enabled: boolean;
}

interface HandlerOptionsMap {
    ProtoHandler: ProtoHandlerOptions;
    XSSHandler: XSSHandlerOptions;
    PathTraversalHandler: PathTraversalHandlerOptions;
}

export type HandlerName = keyof HandlerOptionsMap;

export interface SecureMiddlewareOptions {
    handlers?: Partial<{
        [key in HandlerName]: HandlerOptionsMap[key] | false;
    }>;
    logLevel?: 'info' | 'warn' | 'error';
}