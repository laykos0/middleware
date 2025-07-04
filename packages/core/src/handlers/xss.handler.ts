import sanitizeHtml from 'sanitize-html';
import sanitize from 'sanitize-html';
import {DefaultHandlerOptions, Handler, HandlerContext, RequestWrapper, ResponseWrapper} from "../";


export interface XSSHandlerOptions extends DefaultHandlerOptions {
    sanitizeLevel?: 'low' | 'medium' | 'high';
}

export class XSSHandler extends Handler {
    private static sanitizeOptions: sanitize.IOptions = {
        // TODO MAKE THIS CONFIGURABLE
        allowedTags: [], // remove all HTML
        allowedAttributes: {}
    };

    static _handle(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<XSSHandlerOptions>) {
        if (!requestWrapper.body) return

        const logger = context.logger;
        const options = context.options;

        let hasChangedRequest = false;

        const sanitizeString = (input: string) => {
            const newHtml = sanitizeHtml(input, this.sanitizeOptions);
            // Quick check as opposed to more lengthy full check. Can give false negatives.
            if (newHtml.length != input.length) {
                hasChangedRequest = true;
            }
            return newHtml;
        };

        // TODO CHECK RECURSIVE EXHAUSTION?
        const sanitizeObject = (obj: any): any => {
            if (typeof obj === 'string') {
                obj = sanitizeString(obj)
            }

            if (Array.isArray(obj)) {
                return obj.map(sanitizeObject);
            }

            if (typeof obj === 'object' && obj !== null) {
                const sanitized: any = {};
                for (const key in obj) {
                    sanitized[key] = sanitizeObject(obj[key]);
                }
                return sanitized;
            }

            return obj;
        };


        if (requestWrapper.body) {
            requestWrapper.body = sanitizeObject(requestWrapper.body);
            if (hasChangedRequest) {
                logger.warn("Sanitized HTML in body");
            }
        }
    }
}
