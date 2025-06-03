export * from "@middleware/express";

import {DynamicModule, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {SECURE_MIDDLEWARE_DEFAULT_OPTIONS, secureMiddleware, SecureMiddlewareOptions} from '@middleware/express';

@Module({})
export class SecureMiddlewareModule implements NestModule {
    private static options: SecureMiddlewareOptions;

    static forRoot(options: SecureMiddlewareOptions = SECURE_MIDDLEWARE_DEFAULT_OPTIONS): DynamicModule {
        SecureMiddlewareModule.options = options;
        return {
            module: SecureMiddlewareModule,
            providers: [],
            exports: [],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(secureMiddleware(SecureMiddlewareModule.options))
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}

