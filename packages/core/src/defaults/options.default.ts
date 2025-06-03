import {SecureMiddlewareOptions} from "../";

export const SECURE_MIDDLEWARE_DEFAULT_OPTIONS: SecureMiddlewareOptions = {
    handlers: {
        ProtoHandler: {enabled: true, enable_proto_removal: true, enable_constructor_removal: true, enable_prototype_removal: true},
        PathTraversalHandler: {enabled: true, fieldsToReplace: ["name"]},
        XSSHandler: {enabled: true, sanitizeLevel: "high"},
        CSPHandler: {enabled: true, report_only: false, report_to: undefined},
        SecureHeadersHandler: {enabled: true},
    },
    logLevel: 'debug',
};