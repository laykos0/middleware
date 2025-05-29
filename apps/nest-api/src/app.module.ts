import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {secureMiddleware, SecureMiddlewareOptions} from '@middleware/nest';

const secureMiddlewareOptions: SecureMiddlewareOptions = {
  handlers: {
    ProtoHandler: {enabled: true, configuration: ['example_config_value']},
    PathTraversalHandler: {enabled: true, strict: true},
    XSSHandler: {enabled: true, sanitizeLevel: "high"}
  },
  logLevel: 'info',
};


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(secureMiddleware(secureMiddlewareOptions)).forRoutes('*');
  }
}