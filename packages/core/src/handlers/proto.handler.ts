import { RequestHandler, RequestWrapper } from '@middleware/core';

export class ProtoHandler extends RequestHandler {
    static handleRequest(wrapper: RequestWrapper<unknown>) {
        console.log(`Request Method: ${wrapper.method}`);
        console.log(`Request URL: ${wrapper.url}`);
        return wrapper;
    }
}