import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {secureMiddleware, SecureMiddlewareOptions} from '@middleware/nest';

const secureMiddlewareOptions: SecureMiddlewareOptions = {
  handlers: {
    ProtoHandler: {enabled: true, enable_proto_removal: true, enable_constructor_removal: true, enable_prototype_removal: true},
    PathTraversalHandler: {enabled: true, basedir: "src", fieldsToScan: ["name"]},
    XSSHandler: {enabled: true, sanitizeLevel: "high"},
    CSPHandler: {enabled: true, some_option: true},
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