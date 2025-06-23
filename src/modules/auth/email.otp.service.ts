import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from 'src/core/databases/redis.service';
import { OtpService } from './otp.service';
import { ConfigService } from '@nestjs/config';
import { ResendService } from 'nestjs-resend';

@Injectable()
export class EmailOtpService {
  private readonly MAX_DURATION_LINK: number = 86400;

  constructor(
    private readonly resendService: ResendService,
    private readonly otpService: OtpService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmailLink(email: string) {
    const token = this.otpService.getSessionToken();

    await this.sendEmailToken(token, email);

    const url = `http://${(this.configService.get('HOST_EMAIL_URL') as string) || 'localhost'}:4000/api/users/user/verify-email?token=${token}`;

    const fromEmail = this.configService.get('HOST_EMAIL') as string;

    try {
      await this.resendService.send({
        from: fromEmail,
        to: email,
        subject: 'Hello Word',
        html: ` <a href=${url} style="display: inline-block;
        padding: 10px 20px;
        background-color: blue;
        color: white;
        text-decoration: none;
        border: 2px solid blue;
        border-radius: 5px;">
        Tasdiqlash
        </a>`,
      });

      return token;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendEmailToken(token: string, email: string) {
    const key = `email_verify:${token}`;

    await this.redisService.redis.setex(
      key,
      this.MAX_DURATION_LINK,
      JSON.stringify({
        email,
        createdAt: new Date(),
      }),
    );
  }

  async getEmailToken(token: string) {
    const key = `email_verify:${token}`;

    return await this.redisService.getKey(key);
  }
}
