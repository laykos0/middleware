export abstract class RequestWrapper<T> {
    protected request: T

    constructor(request: T) {
        this.request = request
    }

    // TODO EXTEND TO MORE PROPERTIES
    abstract set method(newMethod: string)
    abstract get method(): string

    abstract set url(newUrl: string)
    abstract get url(): string

    // TODO ADD RESULT FUNCTIONS (detected, etc)

    abstract set body(body: unknown)
    abstract get body(): unknown | undefined
}