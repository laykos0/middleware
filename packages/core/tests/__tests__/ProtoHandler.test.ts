import {ProtoHandler, ProtoHandlerOptions} from '../../src';
import {MockRequestWrapper, MockResponseWrapper} from '../__mocks__/MockWrappers';
import {MockLogger} from "../__mocks__/MockLogger";
import {HandlerContext} from '../../src';

describe('ProtoHandler', () => {
    it('removes __proto__, constructor, and prototype from body when present', () => {
        const request = {
            body: {
                data: "__proto__ constructor prototype __pr__proto__oto__ __prototypeproto__"
            },
            url: "/api/test"
        };

        const reqWrapper = new MockRequestWrapper(request);
        const resWrapper = new MockResponseWrapper({});

        const options: ProtoHandlerOptions = {
            enabled: true,
            enable_proto_removal: true,
            enable_constructor_removal: true,
            enable_prototype_removal: true,
        };

        const context: HandlerContext<ProtoHandlerOptions> = {
            options,
            logger: new MockLogger('info'),
        };

        ProtoHandler.handle(reqWrapper, resWrapper, context);

        const body = reqWrapper.body as { data: string };
        expect(body.data).not.toContain("__proto__");
        expect(body.data).not.toContain("constructor");
        expect(body.data).not.toContain("prototype");
    });

    it('replaces __proto__ in URL', () => {
        const reqWrapper = new MockRequestWrapper({
            url: "/api/__proto__/check",
            body: {}
        });
        const resWrapper = new MockResponseWrapper({});

        const options: ProtoHandlerOptions = {
            enabled: true,
            enable_proto_removal: true
        };

        const context: HandlerContext<ProtoHandlerOptions> = {
            options,
            logger: new MockLogger('info'),
        };

        ProtoHandler.handle(reqWrapper, resWrapper, context);
        expect(reqWrapper.url).not.toContain("__proto__");
    });

    it('does nothing when body is undefined', () => {
        const reqWrapper = new MockRequestWrapper({
            url: "/safe/url"
        });
        const resWrapper = new MockResponseWrapper({});

        const options: ProtoHandlerOptions = {
            enabled: true,
        };

        const context: HandlerContext<ProtoHandlerOptions> = {
            options,
            logger: new MockLogger('info'),
        };

        expect(() => {
            ProtoHandler.handle(reqWrapper, resWrapper, context);
        }).not.toThrow();
    });

    it('leaves clean body and url unchanged', () => {
        const reqWrapper = new MockRequestWrapper({
            body: { message: "hello world" },
            url: "/api/clean"
        });
        const resWrapper = new MockResponseWrapper({});

        const options: ProtoHandlerOptions = {
            enabled: true,
            enable_proto_removal: true,
            enable_constructor_removal: true,
            enable_prototype_removal: true,
        };

        const context: HandlerContext<ProtoHandlerOptions> = {
            options,
            logger: new MockLogger('info'),
        };

        ProtoHandler.handle(reqWrapper, resWrapper, context);

        const body = reqWrapper.body as { message: string };
        expect(body.message).toBe("hello world");
        expect(reqWrapper.url).toBe("/api/clean");
    });
    it('changes nothing if all replacements are disabled', () => {
        const reqWrapper = new MockRequestWrapper({
            body: {
                data: "__proto__ constructor prototype __pr__proto__oto__ __prototypeproto__"
            },
            url: "/api/test"
        });
        const resWrapper = new MockResponseWrapper({});

        const options: ProtoHandlerOptions = {
            enabled: true,
            enable_proto_removal: false,
            enable_constructor_removal: false,
            enable_prototype_removal: false,
        };

        const context: HandlerContext<ProtoHandlerOptions> = {
            options,
            logger: new MockLogger('info'),
        };

        ProtoHandler.handle(reqWrapper, resWrapper, context);

        const body = reqWrapper.body as { data: string };
        expect(body.data).toContain("__proto__");
        expect(body.data).toContain("constructor");
        expect(body.data).toContain("prototype");
    });


});
