import {RequestHandler, RequestWrapper, ResponseWrapper} from "../types/index";
import {DefaultHandlerOptions, SecureMiddlewareOptions} from "./index";

export interface SecureHeadersHandlerOptions extends DefaultHandlerOptions {

}

/**
 * Inserts some basic http headers to increase security without breakage
 **/
export class SecureHeadersHandler extends RequestHandler {
    static handleRequest(requestWrapper: RequestWrapper<unknown>, responseWrapper: ResponseWrapper<unknown>, options: SecureHeadersHandlerOptions) {
        const trySetHeader = (key: string, value: string) => {
            if (responseWrapper.getHeader(key) !== undefined) {
                console.log("SecureHeadersHandler header", key, "already set");
            } else {
                responseWrapper.setHeader(key, value);
            }
        }
        console.log("================= SECURE_HEADERS ============")
        trySetHeader("X-Content-Type-Options", "nosniff") // Prevents MIME-sniffing, reducing XSS risk.
        trySetHeader("Referrer-Policy", "no-referrer-when-downgrade") // Sends the full Referer header only when navigating from HTTPS to another HTTPS page.
        trySetHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload") //  Forces browsers to always use HTTPS, preventing SSL stripping attacks.
        trySetHeader("X-Frame-Options", "SAMEORIGIN") //  Prevents your site from being embedded in an <iframe>, protecting against clickjacking.
        trySetHeader("X-XSS-Protection", "0") // Disable buggy legacy XSS protection which can cause vulnerabilities
    }
}