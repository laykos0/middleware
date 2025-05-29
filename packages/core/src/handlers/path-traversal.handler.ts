import {RequestHandler, RequestWrapper} from "../types";
import {DefaultHandlerOptions} from "./index";

export interface PathTraversalHandlerOptions extends DefaultHandlerOptions {
    strict?: boolean;
}

export class PathTraversalHandler extends RequestHandler {
    static handleRequest<PathTraversalHandlerOptions>(wrapper: RequestWrapper<unknown>, options: PathTraversalHandlerOptions) {

        console.log();
        console.log("================= PATH_TRAVERSAL ============")
        console.log("PATH_TRAVERSAL_OPTIONS", options)


        const body = JSON.stringify(wrapper.body);
        // console.log(body)
        // const targetPath = path.resolve(base, target);
        // if (!targetPath.startsWith(base + path.sep) && targetPath !== base) {
        //     throw new Error('Path traversal attempt detected');
        // }
        //     // return targetPath;

        return wrapper;
    }
}