import {RequestWrapper, ResponseWrapper} from '../types';

interface MockRequestWrapperProps {
    method?: string;
    url?: string;
    body?: any;
}

export class MockRequestWrapper extends RequestWrapper<MockRequestWrapperProps> {
    method: string;
    url: string;
    body: any;

    constructor(
        props: MockRequestWrapperProps
    ) {
        super(props);
        this.method = props.method ?? '';
        this.url = props.url ?? '';
        this.body = props.body;
    }
}

export class MockResponseWrapper extends ResponseWrapper<Record<string, any>> {
    private headers: Record<string, string> = {};

    setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }

    getHeader(key: string): string | undefined {
        return this.headers[key];
    }
}
