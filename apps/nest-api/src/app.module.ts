import {Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SecureMiddlewareModule} from '@middleware/nest';


@Module({
  imports: [
    SecureMiddlewareModule.forRoot({
      logLevel: 'debug',
      handlers: {
        ProtoHandler: { enabled: true, enable_proto_removal: true, enable_constructor_removal: true, enable_prototype_removal: true },
        PathTraversalHandler: { enabled: true, fieldsToReplace: ['name'] },
        XSSHandler: { enabled: true, sanitizeLevel: 'high' },
        CSPHandler: { enabled: true, report_only: false },
        SecureHeadersHandler: { enabled: true },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure() {}
}