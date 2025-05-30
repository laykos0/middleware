import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface CSPHandlerOptions extends DefaultHandlerOptions {
    some_option?: boolean;
}

export class CSPHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: CSPHandlerOptions) {
        console.log()
        console.log("================= CSP ============")

        let currentPolicy = responseWrapper.getHeader("Content-Security-Policy")
        console.log("Current CSP:", currentPolicy)

        // if (currentPolicy != undefined) {
        //     throw new Error("Content Security Policy Already defined!")
        // }

        let test = {
            "base-uri": "'none'",
            "child-src": "'none'",
            "connect-src": "'self'",
            "default-src": "'self'",
            "font-src": "'self'",
            "form-action": "'self'",
            "frame-ancestors": "'none'",
            "frame-src": "'none'",
            "img-src": "'self'",
            "manifest-src": "'self'",
            "media-src": "'self'",
            "object-src": "'none'",
            "prefetch-src": "'self'",
            "script-src": "'self'",
            "style-src": "'self'",
            "worker-src": "'self'",
        }

        let basePolicy: string[][] = [
            ["default-src", "'self'"], // Sets the default allowed sources to same-origin
            ["script-src", "'self'"], // Blocks inline scripts and external JS unless explicitly allowed
            ["style-src", "'self'"], // Prevents loading external CSS (add 'unsafe-inline' cautiously if needed)
            ["object-src", "'none'"], // Blocks Flash and other plugins (strongly recommended)
            ["base-uri", "'self'"], // Prevents attackers from changing the base URL
            ["frame-ancestors", "'none'"], // Prevents clickjacking by disallowing framing of your site
            ["form-action", "'self'"], // Limits where forms can submit data
            ["upgrade-insecure-requests"], // Forces HTTP resources to be loaded over HTTPS
            ["block-all-mixed-content"], // Blocks all mixed content (HTTP on HTTPS pages)
        ];

        // TODO CACHE THIS?
        let finalPolicy = ""
        basePolicy.forEach((policy) => {
            if (currentPolicy?.includes(policy[0])) {
                console.log("Policy:", policy, "is already set, ignoring it");
            } else {
                finalPolicy += policy.join(" ") + ";"
            }
        })

        responseWrapper.setHeader("Content-Security-Policy", finalPolicy)

        let newPolicy = responseWrapper.getHeader("Content-Security-Policy")
        console.log("New CSP:", newPolicy)
    }
}