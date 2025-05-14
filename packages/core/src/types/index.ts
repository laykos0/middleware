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
}

// TODO - FIGURE OUT HOW TO REMOVE THIS
export abstract class RequestConverter<T> {
    abstract getWrapper(req: T): RequestWrapper<T>
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
        HandlerClass.handleRequest(this.wrapper);
        return this;
    }
}

class StringRequestWrapper extends RequestWrapper<string> {
    private _method= "GET"

    constructor(request: string) {
        super(request);
    }

    set method(newMethod: string) {
        this._method = newMethod;
    }

    get method(): string {
        return this._method;
    }

    set url(newUrl: string) {
        this.request = newUrl;
    }

    get url(): string {
        return this.request;
    }
}
