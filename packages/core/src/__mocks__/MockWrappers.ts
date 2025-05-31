import { RequestWrapper, ResponseWrapper } from '../types';

export class MockRequestWrapper extends RequestWrapper<Record<string, any>> {
  methodValue: string = '';
  urlValue: string = '';
  bodyValue: unknown = undefined;

  set method(val: string) { this.methodValue = val; }
  get method() { return this.methodValue; }

  set url(val: string) { this.urlValue = val; }
  get url() { return this.urlValue; }

  set body(val: unknown) { this.bodyValue = val; }
  get body() { return this.bodyValue; }
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
