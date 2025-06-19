import { RedisService } from 'src/core/databases/redis.service';
import { SmsService } from './sms.service';
import { OtpSecurityService } from './otp.security.service';
export declare class OtpService {
    private readonly redisService;
    private readonly smsService;
    private readonly otpSecurityService;
    constructor(redisService: RedisService, smsService: SmsService, otpSecurityService: OtpSecurityService);
    generateOtp(): string;
    getSessionToken(): `${string}-${string}-${string}-${string}-${string}`;
    sendOtp(phone_number: string): Promise<true | undefined>;
    checkOtpExisted(key: string): Promise<void>;
    verifyOtpSendUser(key: string, code: string, phone_number: string): Promise<`${string}-${string}-${string}-${string}-${string}`>;
    checkSessionTokenUser(key: string, token: string): Promise<void>;
    delSessionTokenUser(key: string): Promise<void>;
}
