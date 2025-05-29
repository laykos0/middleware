import {RequestHandler, RequestWrapper} from "../types";
import sanitizeHtml from 'sanitize-html';
import sanitize from "sanitize-html";

export interface XSSHandlerOptions {
    sanitizeLevel?: 'low' | 'medium' | 'high';
}

export class XSSHandler extends RequestHandler {
    private static sanitizeOptions: sanitize.IOptions = {
        // TODO MAKE THIS CONFIGURABLE
        allowedTags: [], // remove all HTML
        allowedAttributes: {}
    };

    static handleRequest(wrapper: RequestWrapper<unknown>) {
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
                sanitizeString(obj)
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

        if (wrapper.body) {
            wrapper.body = sanitizeObject(wrapper.body);
            if (hasChangedRequest) {
                console.log("Sanitized HTML in body");
            }
        }

    }
}
