
export function detectSQLInjection(context: unknown): boolean {
    console.log(context);
    // const dangerousPatterns = /(' OR 1=1|DROP TABLE|--|#)/i;
    //
    // if (typeof context.body === 'string' && dangerousPatterns.test(context.body)) {
    //     return true;
    // }
    //
    // // Check query parameters
    // for (const key in context.query) {
    //     if (dangerousPatterns.test(String(context.query[key]))) {
    //         return true;
    //     }
    // }

    return false;
}
// export * from './types';