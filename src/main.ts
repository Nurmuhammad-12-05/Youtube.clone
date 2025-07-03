import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

    const config = new DocumentBuilder()
      .setTitle('Net Chat API')
      .setDescription('Net Chat platformasi uchun Swagger hujjatlari')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
    console.log(
      `🚀 Swagger: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
    );
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
