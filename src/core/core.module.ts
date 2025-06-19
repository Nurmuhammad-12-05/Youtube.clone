import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseModule } from './databases/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ResendModule } from 'nestjs-resend';
import VideoProcessingService from './video.processing.service';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [JwtModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: '8h',
        },
      }),
      inject: [ConfigService],
    }),
    ResendModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('RESEND_API_KEY') as string,
      }),
      inject: [ConfigService],
    }) as DynamicModule,
  ],
  providers: [VideoProcessingService],
  exports: [VideoProcessingService],
})
export class CoreModule {}
