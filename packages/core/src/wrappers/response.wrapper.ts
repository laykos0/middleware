export abstract class ResponseWrapper<T> {
    protected response: T

    constructor(response: T) {
        this.response = response
    }

    abstract setHeader(key: string, value: string): void

    abstract getHeader(key: string): string | undefined
}