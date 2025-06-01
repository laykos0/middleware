import {MockRequestWrapper, MockResponseWrapper} from '../__mocks__/MockWrappers';
import {MockLogger} from "../__mocks__/MockLogger";
import {CSPHandler, CSPHandlerOptions, HandlerContext} from "../../src";

describe('CSPHandler', () => {
    it('adds default CSP headers if none exist', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: CSPHandlerOptions = {
            enabled: true,
            report_only: false
        };

        const context: HandlerContext<CSPHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        CSPHandler.handle(reqWrapper, resWrapper, context);

        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).toContain("default-src 'self'");
        expect(result).toContain("script-src 'self'");
    });

    it('respects report_only and adds report_to if set', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: CSPHandlerOptions = {
            enabled: true,
            report_only: true,
            report_to: 'https://report.example.com'
        };

        const context: HandlerContext<CSPHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };


        CSPHandler.handle(reqWrapper, resWrapper, context);

        const result = resWrapper.getHeader('Content-Security-Policy-Report-Only');
        expect(result).toContain("default-src 'self'");
        expect(result).toContain("report-to https://report.example.com");
    });

    it('only adds report-to if report-only is enabled', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: CSPHandlerOptions = {
            enabled: true,
            report_only: false,
            report_to: 'https://report.example.com'
        };

        const context: HandlerContext<CSPHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        CSPHandler.handle(reqWrapper, resWrapper, context);

        const reportResult = resWrapper.getHeader('Content-Security-Policy-Report-Only');
        expect(reportResult).toEqual(undefined)
        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).not.toContain("report-to https://report.example.com");
    });

    it('only adds headers if enabled', () => {
        const reqWrapper = new MockRequestWrapper({});
        const resWrapper = new MockResponseWrapper({});

        const options: CSPHandlerOptions = {
            enabled: false,
            report_only: false,
            report_to: undefined
        };

        const context: HandlerContext<CSPHandlerOptions> = {
            options: options,
            logger: new MockLogger('info'),
        };

        CSPHandler.handle(reqWrapper, resWrapper, context);

        const result = resWrapper.getHeader('Content-Security-Policy');
        expect(result).toEqual(undefined)
    });
});
