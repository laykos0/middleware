import {HandlerContext, XSSHandler, XSSHandlerOptions} from '../../src';
import {MockRequestWrapper, MockResponseWrapper} from '../__mocks__/MockWrappers';
import {MockLogger} from "../__mocks__/MockLogger";

describe('XSSHandler', () => {
    it('sanitizes string values in request body', () => {
        const maliciousInput = "<script>alert('XSS');</script>";
        const reqWrapper = new MockRequestWrapper({body: maliciousInput});
        const resWrapper = new MockResponseWrapper({});

        const options: XSSHandlerOptions = {
            enabled: true,
            sanitizeLevel: 'low'
        };

        const context: HandlerContext<XSSHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        XSSHandler.handle(reqWrapper, resWrapper, context);
        expect(reqWrapper.body).toBe(""); // All tags removed
    });

    it('it does not sanitize when disabled', () => {
        const maliciousInput = "<script>alert('XSS');</script>";
        const reqWrapper = new MockRequestWrapper({body: maliciousInput});
        const resWrapper = new MockResponseWrapper({});

        const options: XSSHandlerOptions = {
            enabled: false,
            sanitizeLevel: 'low'
        };

        const context: HandlerContext<XSSHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        XSSHandler.handle(reqWrapper, resWrapper, context);
        expect(reqWrapper.body).toBe(maliciousInput);
    });


    it('recursively sanitizes nested objects', () => {
        const request = {
            body: {
                safe: "hello",
                unsafe: "<img src=x onerror=alert('XSS')>",
                nested: {
                    html: "<div>test</div><script>alert('x')</script>"
                }
            }
        }

        const reqWrapper = new MockRequestWrapper(request);
        const resWrapper = new MockResponseWrapper({});

        const options: XSSHandlerOptions = {
            enabled: true,
        };

        const context: HandlerContext<XSSHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        XSSHandler.handle(reqWrapper, resWrapper, context);

        const sanitizedBody = reqWrapper.body as {
            safe: string;
            unsafe: string;
            nested: { html: string };
        };
        expect(sanitizedBody.unsafe).toBe('');
        expect(sanitizedBody.nested.html).toBe('test'); // Tags removed, text left
    });

    it('does not modify non-string body values', () => {
        const reqWrapper = new MockRequestWrapper({
            body: {
                number: 123,
                bool: true,
                nullVal: null
            }
        });
        const resWrapper = new MockResponseWrapper({});


        const options: XSSHandlerOptions = {
            enabled: true,
        };

        const context: HandlerContext<XSSHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };
        XSSHandler.handle(reqWrapper, resWrapper, context);

        const body = reqWrapper.body as {
            number: number,
            bool: boolean,
            nullVal: unknown
        };
        expect(body.number).toBe(123);
        expect(body.bool).toBe(true);
        expect(body.nullVal).toBe(null);
    });

    it('does nothing if request body is undefined', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: XSSHandlerOptions = {
            enabled: true,
        };

        const context: HandlerContext<XSSHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        expect(() => {
            XSSHandler.handle(reqWrapper, resWrapper, context);
        }).not.toThrow();
    });
});
