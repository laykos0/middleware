import {SecureMiddlewareOptions} from "../handlers";
import {options} from "sanitize-html";

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

    abstract set body(body: string)
    abstract get body(): string | undefined
}

export abstract class ResponseWrapper<T> {
    protected response: T

    constructor(response: T) {
        this.response = response
    }

    abstract setHeader(key: string, value: string): void

    abstract getHeader(key: string): string | undefined
}


export abstract class RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>, options: SecureMiddlewareOptions): void {
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
        private options: SecureMiddlewareOptions,
        private readonly request?: Req,
        private readonly response?: Res,
    ) {
        if (request !== undefined) {
            this.requestWrapper = new this.ReqWrapper(request);
        }
        if (response !== undefined) {
            this.responseWrapper = new this.ResWrapper(response);
        }
        this.options = options;
    }

    intercept(request: Req): RequestHandlerBuilder<Req, Res> {
        return new RequestHandlerBuilder(this.ReqWrapper, this.ResWrapper, this.options, request);
    }

    setOptions(options: SecureMiddlewareOptions): RequestHandlerBuilder<Req, Res> {
        this.options = options;
        return this
    }

    then<H extends typeof RequestHandler>(
        HandlerClass: H
    ): RequestHandlerBuilder<Req, Res> {
        if (!this.requestWrapper) {
            throw new Error("No request to handle");
        }
        try {
            HandlerClass.handleRequest(this.requestWrapper, this.options);
        } catch (e) {
            console.error("Unhandled handler exception", HandlerClass.name, e);
        }
        return this;
    }
}
