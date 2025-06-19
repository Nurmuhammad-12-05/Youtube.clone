"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpSecurityService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../core/databases/redis.service");
let OtpSecurityService = class OtpSecurityService {
    redisService;
    maxAttempsOtp = 3;
    blockedDuration = 3600;
    otpAttemptsDuration = 1850;
    constructor(redisService) {
        this.redisService = redisService;
    }
    async recordFailedOtpAttempts(phone_number) {
        const key = `atp_attempts:${phone_number}`;
        const checkExistsKey = await this.redisService.redis.exists(key);
        if (!checkExistsKey) {
            await this.redisService.redis.incr(key);
            await this.redisService.redis.expire(key, this.otpAttemptsDuration);
        }
        else {
            await this.redisService.redis.incr(key);
        }
        const attempts = +(await this.redisService.getKey(key));
        const res = this.maxAttempsOtp - attempts;
        if (res === 0)
            await this.temporaryBlockUser(phone_number, attempts);
        return res;
    }
    async temporaryBlockUser(phone_number, attempts) {
        const key = `temporary_blocked_user:${phone_number}`;
        const date = Date.now();
        await this.redisService.redis.setex(key, this.blockedDuration, JSON.stringify({
            blockedAt: date,
            attempts,
            reason: `To many attempts`,
            unblockeAt: date + this.blockedDuration * 1000,
        }));
        await this.delOtpAttempts(`otp_attempts:${phone_number}`);
    }
    async checkIfTemporaryBlockedUser(phone_number) {
        const key = `temporary_blocked_user:${phone_number}`;
        const data = await this.redisService.getKey(key);
        if (data) {
            const ttlKey = await this.redisService.getTtlKey(key);
            throw new common_1.BadRequestException({
                message: `You tried too much, please try after ${Math.floor(ttlKey / 60)} minutes`,
            });
        }
    }
    async delOtpAttempts(key) {
        await this.redisService.delKey(key);
    }
};
exports.OtpSecurityService = OtpSecurityService;
exports.OtpSecurityService = OtpSecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], OtpSecurityService);
//# sourceMappingURL=otp.security.service.js.map