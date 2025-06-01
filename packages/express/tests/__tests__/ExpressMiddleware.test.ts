// tests/authMiddleware.test.ts
import {NextFunction, Request, Response} from 'express';
import {secureMiddleware, SecureMiddlewareOptions} from "../../src";
import httpMocks = require('node-mocks-http');

describe('secureMiddleware', () => {
    it('prototype pollution prevention works using a real request', () => {
        const req = httpMocks.createRequest<Request>({
            method: 'GET',
            url: '/api/__proto__',
        });

        const res = httpMocks.createResponse<Response>();
        const next: NextFunction = jest.fn();
        const secureMiddlewareOptions: SecureMiddlewareOptions = {
            handlers: {
                ProtoHandler: {
                    enabled: true,
                    enable_proto_removal: true,
                    // enable_constructor_removal: true,
                    // enable_prototype_removal: true
                },
                // PathTraversalHandler: {enabled: true, basedir: "./src", fieldsToReplace: ["name"]},
                // XSSHandler: {enabled: true, sanitizeLevel: "high"},
                // CSPHandler: {enabled: true, report_only: false, report_to: undefined},
                // SecureHeadersHandler: {enabled: true},
            },
            logLevel: 'debug',
        };

        const middleware = secureMiddleware(secureMiddlewareOptions);
        middleware(req, res, next);

        // Test that the proto handler works
        expect(req.url).not.toContain('__proto__');

        expect(next).toHaveBeenCalled();
        expect(res._isEndCalled()).toBe(false); // middleware doesn't end response
    });

});
