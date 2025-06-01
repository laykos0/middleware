import {DefaultHandlerOptions, Handler, HandlerContext, RequestWrapper, ResponseWrapper} from "../";


export interface CSPHandlerOptions extends DefaultHandlerOptions {
    /** Change the Content-Security-Policy to Content-Security-Policy-Report-Only */
    report_only?: boolean;
    /** Where to report the content security policy errors. Report_only must be set for this to be applied. */
    report_to?: string;
}

export class CSPHandler extends Handler {
    static _handle(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, context: HandlerContext<CSPHandlerOptions>) {
        const logger = context.logger;
        const options = context.options;

        let currentPolicy = responseWrapper.getHeader("Content-Security-Policy")
        logger.info("Current CSP:", currentPolicy)

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
                logger.info("Policy:", policy[0], "is already set, ignoring it!");
            } else {
                finalPolicy += " " + policy.join(" ") + ";"
            }
        })

        let policyHeader;
        if (options.report_only) {
            policyHeader = "Content-Security-Policy-Report-Only";

            if (options.report_to) {
                if (options.report_to.includes(policyHeader)) {
                    logger.info("report-to is already set, ignoring it!");
                } else {
                    finalPolicy += " report-to " + options.report_to + ""
                }
            }
        } else {
            policyHeader = "Content-Security-Policy";
        }

        responseWrapper.setHeader(policyHeader, finalPolicy)

        let newPolicy = responseWrapper.getHeader(policyHeader)
        logger.info("New CSP:", newPolicy)
    }
}