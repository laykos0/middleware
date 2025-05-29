import {
    ProtoHandler,
    RequestHandlerBuilder,
    RequestWrapper,
    XSSHandler,
    PathTraversalHandler,
    SecureMiddlewareOptions, ResponseWrapper
} from "@middleware/core";
import {NextFunction, Request, Response} from 'express';
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
    static intercept(req: Request) {
        return new RequestHandlerBuilder(NestRequestWrapper, NestResponseWrapper, {}, req);
    }
}

export function secureMiddleware(options: SecureMiddlewareOptions) {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalRequest = {
            method: req.method,
            url: req.url,
            headers: {...req.headers},
            body: {...req.body},
            query: {...req.query},
            params: {...req.params},
        };

        NestBuilder.intercept(req)
            // Should we have SetOptions?
            .setOptions(options)
            .then(ProtoHandler)
            .then(XSSHandler)
            .then(PathTraversalHandler);

        NestBuilder.intercept(originalRequest as Request)
            .then(PathTraversalHandler);

        next();
    };
}
