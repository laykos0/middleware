import {RequestHandler, RequestWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface CSPHandlerOptions extends DefaultHandlerOptions {
}

export class CspHandler extends RequestHandler {
    static handleRequest<CSPHandlerOptions>(wrapper: RequestWrapper<unknown>, options: CSPHandlerOptions) {

        return wrapper;
    }
}