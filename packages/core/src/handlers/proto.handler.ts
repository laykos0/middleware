import {DefaultHandlerOptions, Handler, HandlerContext, RequestWrapper, ResponseWrapper} from "../";
import {options} from "sanitize-html";

class Replacement {
    constructor(public name: string, public regex: RegExp, public replacement: string) {
    }
}

// Important to replace with something not in the string, otherwise you can do __pro__proto__to__
const protoReplacement = new Replacement("Proto", /__proto__/g, "REMOVED_PROTO");
const constructorReplacement = new Replacement("Constructor", /constructor/g, "REMOVED_CONSTRUCTOR");
const prototypeReplacement = new Replacement("Prototype", /prototype/g, "REMOVED_PROTOTYPE");

export interface ProtoHandlerOptions extends DefaultHandlerOptions {
    enable_proto_removal?: boolean;
    enable_constructor_removal?: boolean;
    enable_prototype_removal?: boolean;
}

export class ProtoHandler extends Handler {
    static _handle(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<ProtoHandlerOptions>) {
        let REPLACE_LIST: Replacement[] = [];

        if (context.options.enable_proto_removal) {
            REPLACE_LIST.push(protoReplacement)
        }
        if (context.options.enable_constructor_removal) {
            REPLACE_LIST.push(constructorReplacement)
        }
        if (context.options.enable_prototype_removal) {
            REPLACE_LIST.push(prototypeReplacement)
        }

        const logger = context.logger;

        let body = JSON.stringify(requestWrapper.body);

        if (body) {
            REPLACE_LIST.forEach((replacement) => {
                // Check if this is better than just a replacement
                if (replacement.regex.test(body)) {
                    body = body.replace(replacement.regex, replacement.replacement);
                    logger.warn("Removed " + replacement.name + " in body")
                }
            })
            requestWrapper.body = JSON.parse(body);
        }

        REPLACE_LIST.forEach((replacement) => {
            if (replacement.regex.test(requestWrapper.url)) {
                requestWrapper.url = requestWrapper.url.replace(replacement.regex, replacement.replacement);
                logger.warn("Removed " + replacement.name + " in url")
            }
        })
    }
}