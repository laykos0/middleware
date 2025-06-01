import {DefaultHandlerOptions, Handler, HandlerContext, RequestWrapper, ResponseWrapper} from "../";


export interface SQLInjectHandlerOptions extends DefaultHandlerOptions {
    pattern?: string;
}

export class SQLInjectHandler extends Handler {
    static _handle(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<SQLInjectHandlerOptions>) {
        if (!requestWrapper.body) return

        const logger = context.logger;
        const options = context.options;
        const body = JSON.stringify(requestWrapper.body);
        logger.info(body)


    }
}