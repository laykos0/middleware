import {RequestHandler, RequestWrapper} from "../types/index";
import {SecureMiddlewareOptions} from "./index";

export class CspHandler extends RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>, options: SecureMiddlewareOptions) {

        return wrapper;
    }
}