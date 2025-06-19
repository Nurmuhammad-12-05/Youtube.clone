import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { BigIntInterceptor } from './core/interceptors/bigint.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('/api');

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.useGlobalInterceptors(new BigIntInterceptor());

    app.use(cookieParser());

    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
