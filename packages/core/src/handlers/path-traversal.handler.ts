import {DefaultHandlerOptions, Handler, HandlerContext, RequestWrapper, ResponseWrapper} from "../";
import * as path from "node:path";

export interface PathTraversalHandlerOptions extends DefaultHandlerOptions {
    basedir?: string;
    fieldsToReplace?: string[];
}

export class PathTraversalHandler extends Handler {
    static _handle(
        requestWrapper: RequestWrapper<unknown>,
        responseWrapper: ResponseWrapper<unknown>,
        context: HandlerContext<PathTraversalHandlerOptions>
    ) {
        // TODO ALSO CHECK URL?
        if (!requestWrapper.body) return;

        const logger = context.logger;
        const options = context.options;
        const baseDir = options.basedir ? path.resolve(options.basedir) : process.cwd();
        const fieldsToReplace = new Set(options.fieldsToReplace || []);
        const traversalRegex = /(?:^|\\|\/)(?:\.\.|%2e%2e)(?:\\|\/|$)/i;

        const decodePath = (s: string): string => {
            return s
                .replace(/%2e/gi, '.')
                .replace(/%2f/gi, '/')
                .replace(/%5c/gi, '\\');
        };

        const traverse = (obj: any, currentPath: string[] = [], depth = 0, maxDepth = 1000): any => {
            if (depth > maxDepth) {
                throw new Error("Maximum recursion depth exceeded");
            }

            if (Array.isArray(obj)) {
                return obj.map((item, index) => traverse(item, [...currentPath, String(index)], depth + 1))
            }

            if (obj && typeof obj === 'object') {
                const newObj = { ...obj };
                for (const key in newObj) {
                    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
                        newObj[key] = traverse(
                            newObj[key],
                            [...currentPath, key],
                            depth + 1
                        );
                    }
                }
                return newObj;
            }

            if (typeof obj === 'string') {
                const fullPath = currentPath.join('.');
                const normalizedValue = decodePath(obj);
                if (traversalRegex.test(normalizedValue)) {
                    if (fieldsToReplace.has(fullPath)) {
                        const safeValue = path.join(baseDir, path.basename(obj));
                        logger.warn(
                            `Field "${fullPath}" contained unsafe path ("${obj}"). ` + `Replaced with safe path ("${safeValue}").`
                        );
                        return safeValue;
                    } else {
                        logger.warn(
                            `Potential path traversal detected in ` + `field "${fullPath}": "${obj}"`
                        );
                    }
                }
            }

            return obj;
        };

        requestWrapper.body = traverse(requestWrapper.body);
    }
}