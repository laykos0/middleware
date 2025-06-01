import {
    CSPHandler,
    HandlerBuilder,
    PathTraversalHandler,
    ProtoHandler,
    RequestWrapper,
    ResponseWrapper,
    SecureHeadersHandler,
    SecureMiddlewareOptions,
    XSSHandler,
} from "@middleware/core";
import {NextFunction, Request, Response} from 'express';

export type { SecureMiddlewareOptions } from '@middleware/core';

class ExpressRequestWrapper extends RequestWrapper<Request> {
    set method(newMethod: string) {
        this.request.method = newMethod;
    }

    get method(): string {
        return this.request.method;
    }

    set url(newUrl: string) {
        this.request.url = newUrl;
    }

    get url(): string {
        return this.request.url;
    }


    set body(body: any) {
        this.request.body = body;
    }

    get body(): any {
        return this.request.body;
    }
}

class ExpressResponseWrapper extends ResponseWrapper<Response> {
    setHeader(key: string, value: string): void {
        this.response.setHeader(key, value);
    }

    getHeader(key: string): string | undefined {
        return this.response.getHeader(key)?.toString();
    }
}


class ExpressBuilder extends HandlerBuilder<Request, Response> {
    static intercept(options: SecureMiddlewareOptions, req?: Request, res?: Response) {
        return new HandlerBuilder(ExpressRequestWrapper, ExpressResponseWrapper, options, req, res);
    }
}

export function secureMiddleware(options: SecureMiddlewareOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        // For testing
        res.setHeader("Content-Security-Policy",  "script-src 'self' https://apis.google.com;")
        res.setHeader("X-Frame-Options", "DENY")

        ExpressBuilder.intercept(options, req, res)
            .then(ProtoHandler)
            .then(XSSHandler)
            .then(PathTraversalHandler)
            .then(SecureHeadersHandler)
            .then(CSPHandler);
        next();
    };
}
