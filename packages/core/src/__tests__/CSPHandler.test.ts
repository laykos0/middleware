import {CSPHandler} from '../handlers';
import {MockRequestWrapper, MockResponseWrapper} from '../__mocks__/MockWrappers';
import {SecureMiddlewareOptions} from '../handlers';

describe('CSPHandler', () => {
    it('adds default CSP headers if none exist', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: SecureMiddlewareOptions = {
            handlers: {
                CSPHandler: {
                    enabled: true,
                    report_only: false
                }
            }
        };

        CSPHandler.handleRequest(reqWrapper, resWrapper, options.handlers!.CSPHandler!);

        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).toContain("default-src 'self'");
        expect(result).toContain("script-src 'self'");
    });

    it('respects report_only and adds report_to if set', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: SecureMiddlewareOptions = {
            handlers: {
                CSPHandler: {
                    enabled: true,
                    report_only: true,
                    report_to: 'https://report.example.com'
                }
            }
        };

        CSPHandler.handleRequest(reqWrapper, resWrapper, options.handlers!.CSPHandler!);

        const result = resWrapper.getHeader('Content-Security-Policy-Report-Only');
        expect(result).toContain("default-src 'self'");
        expect(result).toContain("report-to https://report.example.com");
    });

    it('only adds report-to if report-only is enabled', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: SecureMiddlewareOptions = {
            handlers: {
                CSPHandler: {
                    enabled: true,
                    report_only: false,
                    report_to: 'https://report.example.com'
                }
            }
        };

        CSPHandler.handleRequest(reqWrapper, resWrapper, options.handlers!.CSPHandler!);

        const reportResult = resWrapper.getHeader('Content-Security-Policy-Report-Only');
        expect(reportResult).toEqual(undefined)
        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).not.toContain("report-to https://report.example.com");
    });

    it('only adds headers if enabled', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: SecureMiddlewareOptions = {
            handlers: {
                CSPHandler: {
                    enabled: false,
                    report_only: false,
                    report_to: undefined
                }
            }
        };

        CSPHandler.handleRequest(reqWrapper, resWrapper, options.handlers!.CSPHandler!);

        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).toEqual(undefined)
    });


});
