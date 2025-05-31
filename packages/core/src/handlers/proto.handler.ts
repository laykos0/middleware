import {HandlerContext, RequestHandler, RequestWrapper, ResponseWrapper} from "../types";
import {DefaultHandlerOptions} from "./index";

class Replacement {
    constructor(public name: string, public regex: RegExp, public replacement: string) {
    }
}

const REPLACE_LIST: Replacement[] = [
    // Important to replace with something not in the string, otherwise you can do __pro__proto__to__
    new Replacement("Proto", /__proto__/g, "REMOVED_PROTO"),
    new Replacement("Constructor", /constructor/g, "REMOVED_CONSTRUCTOR"),
    new Replacement("Prototype", /prototype/g, "REMOVED_PROTOTYPE")
]

export interface ProtoHandlerOptions extends DefaultHandlerOptions {
    enable_proto_removal?: boolean;
    enable_constructor_removal?: boolean;
    enable_prototype_removal?: boolean;
}

export class ProtoHandler extends RequestHandler {
     static _handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<ProtoHandlerOptions>) {
         if (!requestWrapper.body) return

         const logger = context.logger;
         const options = context.options;

        let body = JSON.stringify(requestWrapper.body);

        if (body) {
            REPLACE_LIST.forEach((replacement) => {
                // Check if this is better than just a replacement
                if (replacement.regex.test(body)) {
                    body = body.replace(replacement.regex, replacement.replacement);
                    console.log("Removed " + replacement.name + " in body")
                }
            })
        }

        requestWrapper.body = JSON.parse(body);

        REPLACE_LIST.forEach((replacement) => {
            if (replacement.regex.test(requestWrapper.url)) {
                requestWrapper.url = requestWrapper.url.replace(replacement.regex, replacement.replacement);
                logger.info("Removed " + replacement.name + " in url")
            }
        })

    }
}