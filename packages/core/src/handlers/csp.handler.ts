import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface CSPHandlerOptions extends DefaultHandlerOptions {
    test?: boolean;
}

export class CSPHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: CSPHandlerOptions) {
        console.log(options)

        let currentPolicy = responseWrapper.getHeader("Content-Security-Policy")
        console.log("CURRENT POLICY =  ", currentPolicy)
    }
}