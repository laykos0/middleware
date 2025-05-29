import {RequestHandler, RequestWrapper} from "../types/index";
import {SecureMiddlewareOptions} from "./index";

export class SQLInjectHandler extends RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>, options: SecureMiddlewareOptions) {

        console.log("================= SQL INJECT ============")
        const body = JSON.stringify(wrapper.body);
        console.log(body)
        

        return wrapper;
    }
}