import {RequestHandler, RequestWrapper} from "../types/index";

const PROTO = "__proto__";
const PROTO_REGEX = /__proto__/g;
const PROTO_REPLACEMENT = "REMOVED_PROTO"

export class ProtoHandler extends RequestHandler {

    // Important to replace with something not in the string, otherwise you can do __pro__proto__to__

    static handleRequest(wrapper: RequestWrapper<unknown>) {
        console.log("================= PROTO ============")

        let body = JSON.stringify(wrapper.body);
        if (body.includes(PROTO)) {
            body = JSON.parse(body.replace(PROTO_REGEX, PROTO_REPLACEMENT));
            console.log("Removed proto in body")
        }

        wrapper.body = body;

        if (wrapper.url.includes(PROTO)) {
            wrapper.url = wrapper.url.replace(PROTO, PROTO_REPLACEMENT);
            console.log("Removed proto in url")
        }

        return wrapper;
    }
}