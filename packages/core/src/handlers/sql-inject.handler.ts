import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types";
import {DefaultHandlerOptions} from "./index";

export interface SQLInjectHandlerOptions extends DefaultHandlerOptions {
    pattern?: string;
}

export class SQLInjectHandler extends RequestHandler {
    static _handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: SQLInjectHandlerOptions) {
        if (!requestWrapper.body) return

        console.log();
        console.log("================= SQL INJECT ============")
        const body = JSON.stringify(requestWrapper.body);
        console.log(body)


        return;
    }
}