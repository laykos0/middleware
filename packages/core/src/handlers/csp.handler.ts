import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface CSPHandlerOptions extends DefaultHandlerOptions {
    some_option?: boolean;
}

export class CSPHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: CSPHandlerOptions) {
        let currentPolicy = responseWrapper.getHeader("Content-Security-Policy")
        console.log()
        console.log("================= CSP ============")
        console.log("Current CSP:", currentPolicy)

        let basePolicy: string[][] = [
            ["base-uri", "'self'"],                     // Restrict <base> tag to same origin
            ["block-all-mixed-content"],                // Block HTTP content on HTTPS pages
            ["connect-src", "'self'"],                  // Limit fetch/XHR/WebSocket connections to same origin
            ["default-src", "'self'"],                  // Default policy: restrict to same origin
            ["font-src", "'self'"],                     // Restrict font loading to same origin
            ["form-action", "'self'"],                  // Only allow form submissions to same origin
            ["frame-ancestors", "'none'"],              // Prevent framing (clickjacking protection)
            ["img-src", "'self' data:"],                // Restrict images to same origin or inline data URLs
            ["manifest-src", "'self'"],                 // Restrict web app manifest to same origin
            ["media-src", "'self'"],                    // Restrict audio and video media sources
            ["object-src", "'none'"],                   // Disallow plugins like Flash
            ["script-src", "'self'"],                   // Restrict scripts to same origin
            ["style-src", "'self' 'unsafe-inline'"],    // Allow same-origin styles and inline styles (common in frameworks)
            ["upgrade-insecure-requests"],              // Upgrade HTTP requests to HTTPS
            ["worker-src", "'self'"],                   // Restrict where web workers or service workers can be loaded from
        ];

        let finalPolicy = currentPolicy ?? "";
        // TODO CACHE THIS?
        basePolicy.forEach((policy) => {
            if (currentPolicy?.includes(policy[0])) {
                console.log("Policy:", policy[0], "is already set, ignoring it!");
            } else {
                finalPolicy += " " + policy.join(" ") + ";"
            }
        })

        responseWrapper.setHeader("Content-Security-Policy", finalPolicy)

        let newPolicy = responseWrapper.getHeader("Content-Security-Policy")
        console.log("New CSP:", newPolicy)
    }
}