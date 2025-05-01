// src/nestMiddleware.ts
import {detectSQLInjection} from "@middleware/core";
import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

//
// class NestRequestWrapper extends RequestWrapper<Request> {
//     constructor(request: Request) {
//         super(request);
//     }
//
//     set method(newMethod: string) {
//         this.request.method = newMethod;
//     }
//
//     get method(): string {
//         return this.request.method;
//     }
//
//     set url(newUrl: string) {
//         this.request.url = newUrl;
//     }
//
//     get url(): string {
//         return this.request.url;
//     }
// }
//
// class NestRequestConverter extends RequestConverter<Request> {
//     getWrapper(request: Request): RequestWrapper<Request> {
//         return new NestRequestWrapper(request);
//     }
// }
//
// // Example request handler
// class RequestLogger<T> extends RequestHandler<T> {
//     handleRequest(wrapper: RequestWrapper<T>): RequestWrapper<T> {
//         console.log(`Request Method: ${wrapper.method}`);
//         console.log(`Request URL: ${wrapper.url}`);
//         return wrapper;
//     }
// }
//
//
//
// // // Example request convertor
// // class ExpressRequestConverter extends RequestConverter<Partial<Request>> {
// //     getContext(req: Request): RequestContext {
// //         return {
// //             method: req.method,
// //             url: req.url,
// //             headers: {},
// //             extend(metadata: RequestMetadata): ExtendedRequest {
// //                 return new ExtendedRequest(this, metadata);
// //             }
// //         };
// //     }
// //
// //     getRequest(ctx: RequestContext): Partial<Request> {
// //         return {
// //             method: ctx.method,
// //             url: ctx.url,
// //             originalUrl: ctx.url,
// //             headers: ctx.headers,
// //             body: ctx.body,
// //             params: ctx.params || {},
// //             query: ctx.query || {},
// //         }
// //     }
// // }
//
// @Injectable()
// export class SQLInjectionMiddleware implements NestMiddleware {
//     converter = new NestRequestConverter();
//     builder = new RequestHandlerBuilder(converter);
//     logger = new RequestLogger(converter);
//
//     use(req: Request, res: Response, next: NextFunction) {
//         console.log("RUNNING SQL INJECTION MIDDLEWARE")
//
//         this.builder
//             .intercept(req)
//             .then(logger)
//
//
//         // if (detectSQLInjection(context)) {
//         //     return res.status(400).send('Potential SQL Injection detected');
//         // }
//
//         next();
//     }
// }


@Injectable()
export class SQLInjectionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log("BANANINI")
        detectSQLInjection("CHIMPANZINI");
        next();
    }
}
