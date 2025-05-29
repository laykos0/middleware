import {RequestHandler, RequestWrapper} from "../types/index";

export interface PathTraversalHandlerOptions {
    strict?: boolean;
}

export class PathTraversalHandler extends RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>) {

        console.log("================= PATH_TRAVERSAL ============")
        console.log(wrapper.body);
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