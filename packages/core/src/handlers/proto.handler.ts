import {RequestHandler, RequestWrapper} from "../types";

class Replacement {
    constructor(public name: string, public regex: RegExp, public replacement: string) {
    }
}

const REJECT_LIST = [
    // Important to replace with something not in the string, otherwise you can do __pro__proto__to__
    new Replacement("Proto", /__proto__/g, "REMOVED_PROTO"),
    new Replacement("Constructor", /constructor/g, "REMOVED_CONSTRUCTOR"),
    new Replacement("Prototype", /prototype/g, "REMOVED_PROTOTYPE")
]

export class ProtoHandler extends RequestHandler {

    static handleRequest(wrapper: RequestWrapper<unknown>) {
        console.log("================= PROTO ============")

        let body = JSON.stringify(wrapper.body);

        if (body) {
            REJECT_LIST.forEach((replacement) => {
                // Check if this is better than just a replacement
                if (replacement.regex.test(body)) {
                    body = body.replace(replacement.regex, replacement.replacement);
                    console.log("Removed " + replacement.name + " in body")
                }
            })
        }

        wrapper.body = body;

        REJECT_LIST.forEach((replacement) => {
            if (replacement.regex.test(wrapper.url)) {
                wrapper.url = wrapper.url.replace(replacement.regex, replacement.replacement);
                console.log("Removed " + replacement.name + " in url")
            }
        })

        return wrapper;
    }
}