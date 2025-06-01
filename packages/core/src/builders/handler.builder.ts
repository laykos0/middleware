import {
    Handler,
    HandlerContext,
    HandlerName,
    Logger,
    RequestWrapper,
    ResponseWrapper,
    SecureMiddlewareOptions
} from "../";

type ReqWrapperCtor<T> = new (req: T) => RequestWrapper<T>;
type ResWrapperCtor<T> = new (req: T) => ResponseWrapper<T>;

export class HandlerBuilder<Req, Res> {
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

    then<H extends typeof Handler>(
        HandlerClass: H
    ): HandlerBuilder<Req, Res> {
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
                HandlerClass.handle(this.requestWrapper, this.responseWrapper, context);
            }
        } catch (e) {
            console.error("Unhandled handler exception", HandlerClass.name, e);
        }
        return this;
    }
}