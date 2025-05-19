import {RequestHandler, RequestWrapper} from "../types/index";

export class PathTraversalHandler extends RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>) {

        console.log("================= SQL INJECT ============")
        const body = JSON.stringify(wrapper.body);
        console.log(body)


        return wrapper;
    }
}