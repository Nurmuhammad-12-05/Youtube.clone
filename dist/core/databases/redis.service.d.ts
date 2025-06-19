import Redis from 'ioredis';
export declare class RedisService {
    private readonly logger;
    readonly redis: Redis;
    private readonly duration;
    private readonly sessionDuration;
    constructor();
    setOtp(phone_number: string, ot: string): Promise<"OK">;
    getOtp(key: string): Promise<string | null>;
    getTtlKey(key: string): Promise<number>;
    delKey(key: string): Promise<void>;
    sessionTokenUser(phone_number: string, token: string): Promise<"OK">;
    getKey(key: string): Promise<string | null>;
}
