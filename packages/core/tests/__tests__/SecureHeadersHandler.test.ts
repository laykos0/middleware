import {SecureHeadersHandler, SecureHeadersHandlerOptions} from '../../src';
import {MockRequestWrapper, MockResponseWrapper} from '../__mocks__/MockWrappers';
import {MockLogger} from '../__mocks__/MockLogger';
import {HandlerContext} from '../../src';

describe('SecureHeadersHandler', () => {
    it('sets all secure headers when not already present', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: SecureHeadersHandlerOptions = {
            enabled: true
        };

        const context: HandlerContext<SecureHeadersHandlerOptions> = {
            options,
            logger: new MockLogger('info')
        };

        SecureHeadersHandler.handle(reqWrapper, resWrapper, context);

        expect(resWrapper.getHeader("X-Content-Type-Options")).toBeDefined();
        expect(resWrapper.getHeader("Referrer-Policy")).toBeDefined();
        expect(resWrapper.getHeader("Strict-Transport-Security")).toBeDefined();
        expect(resWrapper.getHeader("X-Frame-Options")).toBeDefined();
        expect(resWrapper.getHeader("X-XSS-Protection")).toBeDefined();

        // Make sure all strings are not defined
        expect(resWrapper.getHeader("RANDOM_UNSET_STRING")).toBeUndefined();
    });

    it('does not overwrite headers if already set', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({
            headers: {
                "X-Content-Type-Options": "custom",
                "Referrer-Policy": "strict-origin"
            }
        });

        const logger = new MockLogger('info');
        const context: HandlerContext<SecureHeadersHandlerOptions> = {
            options: { enabled: true },
            logger
        };

        SecureHeadersHandler.handle(reqWrapper, resWrapper, context);

        // Ensure pre-set headers remain unchanged
        expect(resWrapper.getHeader("X-Content-Type-Options")).toBe("custom");
        expect(resWrapper.getHeader("Referrer-Policy")).toBe("strict-origin");

        // Ensure missing headers are added
        expect(resWrapper.getHeader("Strict-Transport-Security")).toBeDefined();
        expect(resWrapper.getHeader("X-Frame-Options")).toBeDefined();
        expect(resWrapper.getHeader("X-XSS-Protection")).toBeDefined();
    });
});
