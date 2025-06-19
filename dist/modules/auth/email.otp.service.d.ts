import { RedisService } from 'src/core/databases/redis.service';
import { OtpService } from './otp.service';
import { ConfigService } from '@nestjs/config';
import { ResendService } from 'nestjs-resend';
export declare class EmailOtpService {
    private readonly resendService;
    private readonly otpService;
    private readonly redisService;
    private readonly configService;
    private readonly MAX_DURATION_LINK;
    constructor(resendService: ResendService, otpService: OtpService, redisService: RedisService, configService: ConfigService);
    sendEmailLink(email: string): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    sendEmailToken(token: string, email: string): Promise<void>;
    getEmailToken(token: string): Promise<string | null>;
}
