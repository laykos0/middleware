import {SecureHeadersHandlerOptions} from "./secure-headers.handler";

export * from './proto.handler'
export * from './sql-inject.handler'
export * from './path-traversal.handler'
export * from './xss.handler'
export * from './csp.handler'
export * from './secure-headers.handler'

import {ProtoHandlerOptions} from './proto.handler'
import {XSSHandlerOptions} from './xss.handler'
import {PathTraversalHandlerOptions} from './path-traversal.handler'
import {CSPHandlerOptions} from "./csp.handler";
import {LogLevel} from "../logger";

export interface DefaultHandlerOptions {
    enabled: boolean;
}

interface HandlerOptionsMap {
    ProtoHandler: ProtoHandlerOptions;
    XSSHandler: XSSHandlerOptions;
    PathTraversalHandler: PathTraversalHandlerOptions;
    CSPHandler: CSPHandlerOptions;
    SecureHeadersHandler: SecureHeadersHandlerOptions;
}

export type HandlerName = keyof HandlerOptionsMap;

export interface SecureMiddlewareOptions {
    handlers?: Partial<{
        [key in HandlerName]: HandlerOptionsMap[key];
    }>;
    logLevel?: LogLevel;
}

export function _flatten(o: Record<string, any>, depth: number = 0, maxDepth: number = 1000): Array<Record<string, any>> {
    if (depth > maxDepth) {
        throw new Error("Maximum recursion depth exceeded");
    }
    return ([] as Array<Record<string, any>>).concat(
        ...Object.keys(o).map((k) => {
            const value = o[k];
            if (value && typeof value === "object" && !Array.isArray(value)) {
                return _flatten(value, depth + 1);
            } else {
                return { [k]: value };
            }
        })
    );
}