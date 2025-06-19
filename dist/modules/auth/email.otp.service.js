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
exports.EmailOtpService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../../core/databases/redis.service");
const otp_service_1 = require("./otp.service");
const config_1 = require("@nestjs/config");
const nestjs_resend_1 = require("nestjs-resend");
let EmailOtpService = class EmailOtpService {
    resendService;
    otpService;
    redisService;
    configService;
    MAX_DURATION_LINK = 86400;
    constructor(resendService, otpService, redisService, configService) {
        this.resendService = resendService;
        this.otpService = otpService;
        this.redisService = redisService;
        this.configService = configService;
    }
    async sendEmailLink(email) {
        const token = this.otpService.getSessionToken();
        await this.sendEmailToken(token, email);
        const url = `http://${this.configService.get('HOST_EMAIL_URL')}:4000/api/user/verify-email?token=${token}`;
        const fromEmail = this.configService.get('HOST_EMAIL');
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async sendEmailToken(token, email) {
        const key = `email_verify:${token}`;
        await this.redisService.redis.setex(key, this.MAX_DURATION_LINK, JSON.stringify({
            email,
            createdAt: new Date(),
        }));
    }
    async getEmailToken(token) {
        const key = `email_verify:${token}`;
        return await this.redisService.getKey(key);
    }
};
exports.EmailOtpService = EmailOtpService;
exports.EmailOtpService = EmailOtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_resend_1.ResendService,
        otp_service_1.OtpService,
        redis_service_1.RedisService,
        config_1.ConfigService])
], EmailOtpService);
//# sourceMappingURL=email.otp.service.js.map