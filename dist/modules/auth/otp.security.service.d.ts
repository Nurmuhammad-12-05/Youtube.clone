import { RedisService } from 'src/core/databases/redis.service';
export declare class OtpSecurityService {
    private readonly redisService;
    private readonly maxAttempsOtp;
    private readonly blockedDuration;
    private readonly otpAttemptsDuration;
    constructor(redisService: RedisService);
    recordFailedOtpAttempts(phone_number: string): Promise<number>;
    temporaryBlockUser(phone_number: string, attempts: number): Promise<void>;
    checkIfTemporaryBlockedUser(phone_number: string): Promise<void>;
    delOtpAttempts(key: string): Promise<void>;
}
