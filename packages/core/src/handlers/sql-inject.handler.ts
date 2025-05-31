import {HandlerContext, RequestHandler, RequestWrapper, ResponseWrapper} from "../types";
import {DefaultHandlerOptions} from "./index";

export interface SQLInjectHandlerOptions extends DefaultHandlerOptions {
    pattern?: string;
}

export class SQLInjectHandler extends RequestHandler {
    static _handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<SQLInjectHandlerOptions>) {
        if (!requestWrapper.body) return

        const logger = context.logger;
        const options = context.options;
        const body = JSON.stringify(requestWrapper.body);
        logger.info(body)


    }
}