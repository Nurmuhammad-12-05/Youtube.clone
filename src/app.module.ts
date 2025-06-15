import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import TransformInterceptor from './core/interceptors/transform.interceptor';
import { AuthGuard } from './core/guards/auth.guard';

@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
