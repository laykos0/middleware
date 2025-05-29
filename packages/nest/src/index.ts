import {ProtoHandler, RequestHandlerBuilder, RequestWrapper, SQLInjectHandler} from "@middleware/core";
import {PathTraversalHandler} from "@middleware/core/dist/handlers/path-traversal.handler";
import { Injectable, Inject, NestMiddleware, MiddlewareConsumer, Module, DynamicModule, NestModule } from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import {XSSHandler} from "@middleware/core/dist/handlers/xss.handler";


class NestRequestWrapper extends RequestWrapper<Request> {
    constructor(request: Request) {
        super(request);
    }

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

class NestBuilder extends RequestHandlerBuilder<Request> {
    static intercept(req: Request) {
        return new RequestHandlerBuilder(NestRequestWrapper, req);
    }
}

@Injectable()
export class SecureMiddleware implements NestMiddleware {
    constructor(@Inject(SECURE_MIDDLEWARE_OPTIONS) private options: SecureMiddlewareOptions) {}

    use(req: Request, res: Response, next: NextFunction) {
        const originalRequest = {
            method: req.method,
            url: req.url,
            headers: { ...req.headers },
            body: { ...req.body },
            query: { ...req.query },
            params: { ...req.params },
        };
        NestBuilder.intercept(req)
            .then(ProtoHandler)
            .then(XSSHandler)
            .then(PathTraversalHandler)

        NestBuilder.intercept(originalRequest as Request)
            .then(PathTraversalHandler);
        next();
    }
}

export interface SecureMiddlewareOptions {
    logLevel?: 'info' | 'warn' | 'error';
}
export const SECURE_MIDDLEWARE_OPTIONS = Symbol('SECURE_MIDDLEWARE_OPTIONS');

@Module({})
export class SecureMiddlewareModule implements NestModule {
    static forRoot(options: SecureMiddlewareOptions): DynamicModule {
        return {
            module: SecureMiddlewareModule,
            providers: [
                {
                    provide: SECURE_MIDDLEWARE_OPTIONS,
                    useValue: options,
                },
                SecureMiddleware
            ],
            exports: [SecureMiddleware],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SecureMiddleware).forRoutes('*');
    }
}