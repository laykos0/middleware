import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SecureMiddleware, SecureMiddlewareModule} from '@middleware/nest';

@Module({
  imports: [
    SecureMiddlewareModule.forRoot({
      logLevel: 'info',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure() {

  }
}