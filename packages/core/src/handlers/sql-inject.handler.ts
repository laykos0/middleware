import {RequestHandler, RequestWrapper} from "../types";
import {DefaultHandlerOptions} from "./index";

export interface SQLInjectHandlerOptions extends DefaultHandlerOptions{
    pattern?: string;
}

export class SQLInjectHandler extends RequestHandler {
    static handleRequest<SQLInjectHandlerOptions>(wrapper: RequestWrapper<unknown>, options: SQLInjectHandlerOptions) {

        console.log();
        console.log("================= SQL INJECT ============")
        const body = JSON.stringify(wrapper.body);
        console.log(body)


        return wrapper;
    }
}