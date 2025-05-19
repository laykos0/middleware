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
    abstract get body(): string
}

export abstract class RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>): void {}
}

type WrapperCtor<T> = new (req: T) => RequestWrapper<T>;
export class RequestHandlerBuilder<T> {
    private readonly wrapper?: RequestWrapper<T>;

    constructor(
        private readonly Wrapper: WrapperCtor<T>,
        private readonly request?: T
    ) {
        if (request !== undefined) {
            this.wrapper = new this.Wrapper(request);
        }
    }

    intercept(request: T): RequestHandlerBuilder<T> {
        return new RequestHandlerBuilder(this.Wrapper, request);
    }

    then<H extends typeof RequestHandler>(
        HandlerClass: H
    ): RequestHandlerBuilder<T> {
        if (!this.wrapper) {
            throw new Error("No request to handle");
        }
        try {
            HandlerClass.handleRequest(this.wrapper);
        } catch (e) {
            console.error("Unhandled handler exception", HandlerClass.name, e);
        }
        return this;
    }
}
