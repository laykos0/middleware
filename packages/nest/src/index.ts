import {
    ProtoHandler,
    RequestHandlerBuilder,
    RequestWrapper,
    XSSHandler,
    PathTraversalHandler,
    SecureMiddlewareOptions, ResponseWrapper
} from "@middleware/core";
import {NextFunction, Request, Response} from 'express';
import {CSPHandler} from "@middleware/core/dist/handlers/csp.handler";
export {SecureMiddlewareOptions} from '@middleware/core';

class NestRequestWrapper extends RequestWrapper<Request> {
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

class NestResponseWrapper extends ResponseWrapper<Response> {
    setHeader(key: string, value: string): void {
        this.response.setHeader(key, value);
    }

    getHeader(key: string): string | undefined {
        return this.response.getHeader(key)?.toString();
    }
}


class NestBuilder extends RequestHandlerBuilder<Request, Response> {
    static intercept(options: SecureMiddlewareOptions, req?: Request, res?: Response) {
        return new RequestHandlerBuilder(NestRequestWrapper, NestResponseWrapper, options, req, res);
    }
}

export function secureMiddleware(options: SecureMiddlewareOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Content-Security-Policy",  "script-src 'self' https://apis.google.com")

        NestBuilder.intercept(options, req, res)
            .then(ProtoHandler)
            .then(XSSHandler)
            .then(PathTraversalHandler)
            .then(CSPHandler);
        next();
    };
}
