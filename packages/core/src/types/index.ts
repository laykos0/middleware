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
    /** How to rewrite the request */
    abstract handleRequest(wrapper: RequestWrapper<any>): void

    run(context: RequestWrapper<any>): RequestWrapper<any> {
        this.handleRequest(context);
        // Test
        console.log("Request " + context.url + " has url " + context.url)
        return context;
    };
}

export class RequestHandlerBuilder<T> {
    private readonly request: T | undefined = undefined
    private readonly requestWrapper: RequestWrapper<T> | undefined = undefined
    private readonly converter: RequestConverter<T>

    constructor(converter: RequestConverter<T>, request: T | undefined = undefined) {
        this.request = request
        this.converter = converter
        if (request) {
            this.requestWrapper = converter.getWrapper(request)
        }
    }

    intercept(request: T): RequestHandlerBuilder<T> {
        return new RequestHandlerBuilder(this.converter, request);
    }

    then(handler: RequestHandler): RequestHandlerBuilder<T> {
        if (!this.requestWrapper) {
            throw new Error("No request to handle");
        }

        handler.run(this.requestWrapper)
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

// Example request convertor
class StringRequestConverter extends RequestConverter<string> {
    getWrapper(request: string): RequestWrapper<string> {
        return new StringRequestWrapper(request);
    }
}

// Example request handler
export class ExampleRequestLogger extends RequestHandler {
    handleRequest(wrapper: RequestWrapper<any>): RequestWrapper<any> {
        console.log(`Request Method: ${wrapper.method}`);
        console.log(`Request URL: ${wrapper.url}`);
        return wrapper;
    }
}


// // Create converter for requests
// const converter = new StringRequestConverter();
// // Create request handler builder
// const builder = new RequestHandlerBuilder(converter);
// // Have your arbitrary request
// const request = "https://example.com";
// const logger = new ExampleRequestLogger();
//
// builder
//     .intercept(request)
//     .then(logger)

