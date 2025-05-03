// src/nestMiddleware.ts
import {detectSQLInjection} from "@middleware/core";
import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {
    ExampleRequestLogger,
    RequestConverter,
    RequestHandlerBuilder,
    RequestWrapper
} from "@middleware/core/dist/types";


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

class NestRequestConverter extends RequestConverter<Request> {
    getWrapper(request: Request): RequestWrapper<Request> {
        return new NestRequestWrapper(request);
    }
}

@Injectable()
export class SQLInjectionMiddleware implements NestMiddleware {
    converter = new NestRequestConverter();
    handler = new RequestHandlerBuilder(this.converter);
    logger = new ExampleRequestLogger();

    use(req: Request, res: Response, next: NextFunction) {
        console.log("RUNNING SQL INJECTION MIDDLEWARE")
        console.log("BANANINI")
        detectSQLInjection("CHIMPANZINI");

        this.handler
            .intercept(req)
            .then(this.logger)

        // if (detectSQLInjection(context)) {
        //     return res.status(400).send('Potential SQL Injection detected');
        // }

        next();
    }
}