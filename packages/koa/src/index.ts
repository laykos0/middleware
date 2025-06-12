import { Context, Next } from 'koa';
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
    SECURE_MIDDLEWARE_DEFAULT_OPTIONS,
} from '@middleware/core';

export { SECURE_MIDDLEWARE_DEFAULT_OPTIONS } from '@middleware/core';
export type { SecureMiddlewareOptions } from '@middleware/core';

class KoaRequestWrapper extends RequestWrapper<Context> {
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

class KoaResponseWrapper extends ResponseWrapper<Context> {
    setHeader(key: string, value: string): void {
        this.response.set(key, value);
    }

    getHeader(key: string): string | undefined {
        return this.response.get(key);
    }
}

class KoaBuilder extends HandlerBuilder<Context, Context> {
    static intercept(options: SecureMiddlewareOptions, ctx: Context) {
        return new HandlerBuilder(KoaRequestWrapper, KoaResponseWrapper, options, ctx, ctx);
    }
}

export function secureMiddleware(
    options: SecureMiddlewareOptions = SECURE_MIDDLEWARE_DEFAULT_OPTIONS
) {
    return async (ctx: Context, next: Next) => {
         KoaBuilder.intercept(options, ctx)
            .then(ProtoHandler)
            .then(XSSHandler)
            .then(PathTraversalHandler)
            .then(SecureHeadersHandler)
            .then(CSPHandler);

        await next();
    };
}
