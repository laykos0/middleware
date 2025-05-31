import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types";
import {_flatten, DefaultHandlerOptions} from "./index";
import * as path from "node:path";

export interface PathTraversalHandlerOptions extends DefaultHandlerOptions {
    basedir?: string;
    fieldsToReplace?: string[];
}

export class PathTraversalHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: PathTraversalHandlerOptions) {
        if (!requestWrapper.body) return

        console.log()
        console.log("================= PATH ============")

        const baseDir = options.basedir ? path.resolve(options.basedir) : process.cwd();
        const fieldsToReplace = options.fieldsToReplace ? options.fieldsToReplace : [];
        const flattened: Record<string, any>  = _flatten(requestWrapper.body as Record<string, any>);
        const traversalRegex = /(\.\.[/\\])/;

        for (const [key, value] of Object.entries(flattened)) {
            if (typeof value === 'string') {
                if (traversalRegex.test(value)) {
                    if (fieldsToReplace.includes(key)) {
                        const safeValue = path.join(baseDir, path.basename(value));
                        console.warn(
                            `[WARNING] Field "${key}" contained an unsafe path (“${value}”). Replacing it with safe path (“${safeValue}”).`
                        );
                        flattened[key] = safeValue;
                    } else {
                        console.warn(
                            `[WARNING] Potential path traversal attempt detected in field "${key}": "${value}"`
                        );
                    }
                }
            }
        }

    }
}