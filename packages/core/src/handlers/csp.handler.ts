import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface CSPHandlerOptions extends DefaultHandlerOptions {
}

export class CspHandler extends RequestHandler {
    static handleRequest<O extends CSPHandlerOptions>(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: O) {
    }
}