import {ProtoHandler, RequestHandlerBuilder, RequestWrapper} from "@middleware/core";
import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';


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
}

class NestBuilder extends RequestHandlerBuilder<Request> {
    static intercept(req: Request) {
        return new RequestHandlerBuilder(NestRequestWrapper, req);
    }
}

// TODO: RENAME MIDDLEWARE
@Injectable()
export class SQLInjectionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        NestBuilder.intercept(req)
            .then(ProtoHandler);
        next();
    }
}