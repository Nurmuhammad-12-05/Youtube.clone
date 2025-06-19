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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../core/databases/redis.service");
const sms_service_1 = require("./sms.service");
const otp_security_service_1 = require("./otp.security.service");
const otp_generator_1 = require("otp-generator");
let OtpService = class OtpService {
    redisService;
    smsService;
    otpSecurityService;
    constructor(redisService, smsService, otpSecurityService) {
        this.redisService = redisService;
        this.smsService = smsService;
        this.otpSecurityService = otpSecurityService;
    }
    generateOtp() {
        const otp = (0, otp_generator_1.generate)(6, {
            digits: true,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });
        return otp;
    }
    getSessionToken() {
        const token = crypto.randomUUID();
        return token;
    }
    async sendOtp(phone_number) {
        await this.otpSecurityService.checkIfTemporaryBlockedUser(phone_number);
        await this.checkOtpExisted(`user:${phone_number}`);
        const tempOtp = this.generateOtp();
        const response = await this.redisService.setOtp(phone_number, tempOtp);
        if (response === 'OK') {
            await this.smsService.sendSms(phone_number, tempOtp);
            return true;
        }
    }
    async checkOtpExisted(key) {
        const checkOtp = await this.redisService.getOtp(key);
        if (checkOtp) {
            const ttl = await this.redisService.getTtlKey(key);
            throw new common_1.BadRequestException(`Please try again after ${ttl} seconds`);
        }
    }
    async verifyOtpSendUser(key, code, phone_number) {
        await this.otpSecurityService.checkIfTemporaryBlockedUser(phone_number);
        const otp = await this.redisService.getOtp(key);
        if (!otp) {
            throw new common_1.BadRequestException('Invalid code');
        }
        if (otp !== code) {
            const attempts = await this.otpSecurityService.recordFailedOtpAttempts(phone_number);
            throw new common_1.BadRequestException({
                message: 'Invalid code',
                attempts: `You have ${attempts} attempts`,
            });
        }
        await this.redisService.delKey(key);
        await this.otpSecurityService.delOtpAttempts(`otp_attempts:${phone_number}`);
        const sessionToken = this.getSessionToken();
        await this.redisService.sessionTokenUser(phone_number, sessionToken);
        return sessionToken;
    }
    async checkSessionTokenUser(key, token) {
        const sessionToken = (await this.redisService.getKey(key));
        if (!sessionToken || sessionToken !== token)
            throw new common_1.BadRequestException('session token expired');
    }
    async delSessionTokenUser(key) {
        await this.redisService.delKey(key);
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        sms_service_1.SmsService,
        otp_security_service_1.OtpSecurityService])
], OtpService);
//# sourceMappingURL=otp.service.js.map