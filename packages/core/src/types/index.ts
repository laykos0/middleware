import {SecureMiddlewareOptions} from "../handlers";
import {options} from "sanitize-html";

export abstract class RequestWrapper<T> {
    protected request: T

    protected constructor(request: T) {
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



export abstract class RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>, options: SecureMiddlewareOptions): void {}
}

type WrapperCtor<T> = new (req: T) => RequestWrapper<T>;
export class RequestHandlerBuilder<T> {
    private readonly wrapper?: RequestWrapper<T>;

    constructor(
        private readonly Wrapper: WrapperCtor<T>,
        private options: SecureMiddlewareOptions,
        private readonly request?: T,
    ) {
        if (request !== undefined) {
            this.wrapper = new this.Wrapper(request);
        }
        this.options = options;
    }

    intercept(request: T): RequestHandlerBuilder<T> {
        return new RequestHandlerBuilder(this.Wrapper, this.options, request);
    }

    setOptions(options: SecureMiddlewareOptions): RequestHandlerBuilder<T> {
        this.options = options;
        return this
    }

    then<H extends typeof RequestHandler>(
        HandlerClass: H
    ): RequestHandlerBuilder<T> {
        if (!this.wrapper) {
            throw new Error("No request to handle");
        }
        try {
            HandlerClass.handleRequest(this.wrapper, this.options);
        } catch (e) {
            console.error("Unhandled handler exception", HandlerClass.name, e);
        }
        return this;
    }
}
