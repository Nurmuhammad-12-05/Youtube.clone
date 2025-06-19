import { ConfigService } from '@nestjs/config';
export declare class SmsService {
    private readonly configService;
    private readonly email;
    private readonly password;
    constructor(configService: ConfigService);
    getToken(): Promise<any>;
    sendSms(phone_number: string, otp: string): Promise<void>;
}
