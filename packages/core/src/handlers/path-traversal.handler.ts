import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types";
import {_flatten, DefaultHandlerOptions} from "./index";
import * as path from "node:path";

export interface PathTraversalHandlerOptions extends DefaultHandlerOptions {
    basedir?: string;
    fieldsToScan?: string[];
}

export class PathTraversalHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: PathTraversalHandlerOptions) {
        console.log()
        console.log("================= PATH ============")

        const baseDir = options.basedir ? path.resolve(options.basedir) : process.cwd();
        const flattened = _flatten(requestWrapper.body as Record<string, any>);
    }
}