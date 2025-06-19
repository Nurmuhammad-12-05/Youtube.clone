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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService {
    logger;
    redis;
    duration = 60;
    sessionDuration = 300;
    constructor() {
        this.logger = new common_1.Logger(RedisService_1.name);
        this.redis = new ioredis_1.default({
            port: +process.env.REDIS_PORT,
            host: process.env.REDIS_HOST,
        });
        this.redis.on('connect', () => {
            this.logger.log('Redis connected');
        });
        this.redis.on('error', (err) => {
            this.logger.error(err);
            this.redis.quit();
            process.exit(1);
        });
    }
    async setOtp(phone_number, ot) {
        const key = `user:${phone_number}`;
        const result = await this.redis.setex(key, this.duration, ot);
        return result;
    }
    async getOtp(key) {
        const otp = await this.redis.get(key);
        return otp;
    }
    async getTtlKey(key) {
        const ttl = await this.redis.ttl(key);
        return ttl;
    }
    async delKey(key) {
        await this.redis.del(key);
    }
    async sessionTokenUser(phone_number, token) {
        const key = `session_token:${phone_number}`;
        const result = await this.redis.setex(key, this.sessionDuration, token);
        return result;
    }
    async getKey(key) {
        const result = await this.redis.get(key);
        return result;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
//# sourceMappingURL=redis.service.js.map