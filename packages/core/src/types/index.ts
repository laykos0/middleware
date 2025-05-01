// export abstract class RequestWrapper<T> {
//     protected request: T
//
//     protected constructor(request: T) {
//         this.request = request
//     }
//
//     abstract set method(newMethod: string)
//     abstract get method(): string
//
//     abstract set url(newUrl: string)
//     abstract get url(): string
// }
//
// // TODO - FIGURE OUT HOW TO REMOVE THIS
// export abstract class RequestConverter<T> {
//     abstract getWrapper(req: T): RequestWrapper<T>
// }
//
//
// export abstract class RequestHandler<T> {
//     converter: RequestConverter<T>
//
//     constructor(converter: RequestConverter<T>) {
//         this.converter = converter
//     }
//
//     /** How to rewrite the request */
//     abstract handleRequest(wrapper: RequestWrapper<T>): void
//
//     run(request: T): T {
//         let context = this.converter.getWrapper(request);
//         this.handleRequest(context);
//         // Test
//         console.log("Request " + context.url + " has url " + context.url)
//         return request;
//     };
// }
//
// export class RequestHandlerBuilder<T> {
//     currentRequest: T | undefined
//
//     constructor(request: T | undefined = undefined) {
//         this.currentRequest = request
//     }
//
//     intercept(request: T): RequestHandlerBuilder<T> {
//         return new RequestHandlerBuilder(request);
//     }
//
//     then(handler: RequestHandler<T>): RequestHandlerBuilder<T> {
//         if (!this.currentRequest) {
//             throw new Error("No request to handle");
//         }
//         handler.run(this.currentRequest)
//         return this;
//     }
// }
//
// class StringRequestWrapper extends RequestWrapper<string> {
//     private _method= "GET"
//
//     constructor(request: string) {
//         super(request);
//     }
//
//     set method(newMethod: string) {
//         this._method = newMethod;
//     }
//
//     get method(): string {
//         return this._method;
//     }
//
//     set url(newUrl: string) {
//         this.request = newUrl;
//     }
//
//     get url(): string {
//         return this.request;
//     }
// }
//
// // Example request convertor
// class StringRequestConverter extends RequestConverter<string> {
//     getWrapper(request: string): RequestWrapper<string> {
//         return new StringRequestWrapper(request);
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
// // // Create converter for requests
// // const converter = new StringRequestConverter();
// // // Create request handler builder
// // const builder = new RequestHandlerBuilder(converter);
// // // Have your arbitrary request
// // const request = "https://example.com";
// // const logger = new RequestLogger(converter);
// //
// // builder
// //     .intercept(request)
// //     .then(logger)
//
