import {
    CSPHandlerOptions,
    Logger,
    LogLevel,
    PathTraversalHandlerOptions,
    ProtoHandlerOptions,
    RequestWrapper,
    ResponseWrapper,
    SecureHeadersHandlerOptions,
    XSSHandlerOptions
} from "../";

export interface DefaultHandlerOptions {
    enabled: boolean;
}

export interface HandlerContext<O extends DefaultHandlerOptions> {
    options: O;
    logger: Logger;
}

export abstract class Handler {
    static handle<O extends DefaultHandlerOptions>(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<O>): void {
        if (context.options.enabled) {
            context.logger.debug(this.name);
            this._handle(requestWrapper, responseWrapper, context);
        }
    }

    protected static _handle<O extends DefaultHandlerOptions>(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<O>): void {
    }
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