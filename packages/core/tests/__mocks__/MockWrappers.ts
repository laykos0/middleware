import {RequestWrapper, ResponseWrapper} from "../../src";


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

interface MockResponseWrapperProps {
    headers?: Record<string, string>;
}

export class MockResponseWrapper extends ResponseWrapper<MockResponseWrapperProps> {
    headers: Record<string, string>;

    constructor(props: MockResponseWrapperProps) {
        super(props);
        this.headers = props.headers ?? {};
    }

    setHeader(key: string, value: string): void {
        this.headers[key] = value;
    }

    getHeader(key: string): string | undefined {
        return this.headers[key];
    }
}
