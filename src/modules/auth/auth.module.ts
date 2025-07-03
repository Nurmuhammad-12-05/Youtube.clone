import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OtpService } from './otp.service';
import { OtpSecurityService } from './otp.security.service';
import { SmsService } from './sms.service';
import { EmailOtpService } from './email.otp.service';
import { ResendModule } from 'nestjs-resend';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpService,
    OtpSecurityService,
    SmsService,
    EmailOtpService,
  ],
  exports: [OtpService, OtpSecurityService, EmailOtpService],
})
export class AuthModule { }
