import {DefaultHandlerOptions, HandlerName, SecureMiddlewareOptions} from "../handlers";
import Logger from "../logger";

export abstract class RequestWrapper<T> {
    protected request: T

    constructor(request: T) {
        this.request = request
    }

    // TODO EXTEND TO MORE PROPERTIES
    abstract set method(newMethod: string)
    abstract get method(): string

    abstract set url(newUrl: string)
    abstract get url(): string

    // TODO ADD RESULT FUNCTIONS (detected, etc)

    abstract set body(body: unknown)
    abstract get body(): unknown | undefined
}

export abstract class ResponseWrapper<T> {
    protected response: T

    constructor(response: T) {
        this.response = response
    }

    abstract setHeader(key: string, value: string): void

    abstract getHeader(key: string): string | undefined
}

export interface HandlerContext<O extends DefaultHandlerOptions> {
    options: O;
    logger: Logger;
}

export abstract class RequestHandler {
    static handleRequest<O extends DefaultHandlerOptions>(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<O>): void {
        if (context.options.enabled) {
            context.logger.debug(this.name);
            this._handleRequest(requestWrapper, responseWrapper, context);
        }
    }

    protected static _handleRequest<O extends DefaultHandlerOptions>(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<O>): void {
    }
}

type ReqWrapperCtor<T> = new (req: T) => RequestWrapper<T>;
type ResWrapperCtor<T> = new (req: T) => ResponseWrapper<T>;

export class RequestHandlerBuilder<Req, Res> {
    private readonly requestWrapper?: RequestWrapper<Req>;
    private readonly responseWrapper?: ResponseWrapper<Res>;

    constructor(
        private readonly ReqWrapper: ReqWrapperCtor<Req>,
        private readonly ResWrapper: ResWrapperCtor<Res>,
        private readonly options: SecureMiddlewareOptions,
        private readonly request?: Req,
        private readonly response?: Res,
    ) {
        if (request !== undefined) {
            this.requestWrapper = new this.ReqWrapper(request);
        }
        if (response !== undefined) {
            this.responseWrapper = new this.ResWrapper(response);
        }
    }

    then<H extends typeof RequestHandler>(
        HandlerClass: H
    ): RequestHandlerBuilder<Req, Res> {
        if (!this.requestWrapper) {
            throw new Error("No request to handle");
        }
        if (!this.responseWrapper) {
            throw new Error("No response to handle");
        }
        try {
            const handlerOptions = this.options.handlers?.[HandlerClass.name as HandlerName];
            if (handlerOptions) {
                const context: HandlerContext<typeof handlerOptions> = {
                    options: handlerOptions,
                    logger: new Logger(this.options.logLevel ?? 'info'),
                };
                HandlerClass.handleRequest(this.requestWrapper, this.responseWrapper, context);
            }
        } catch (e) {
            console.error("Unhandled handler exception", HandlerClass.name, e);
        }
        return this;
    }
}
