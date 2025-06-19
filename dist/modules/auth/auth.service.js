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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("./otp.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/databases/prisma.service");
let AuthService = class AuthService {
    db;
    jwtService;
    otpService;
    constructor(db, jwtService, otpService) {
        this.db = db;
        this.jwtService = jwtService;
        this.otpService = otpService;
    }
    async sendOtpUser(createAuthDto) {
        const findUser = await this.db.prisma.user.findFirst({
            where: {
                phone_number: createAuthDto.phone_number,
            },
        });
        if (findUser)
            throw new common_1.ConflictException('phone_number already exists.');
        const phoneNumber = createAuthDto.phone_number;
        const res = await this.otpService.sendOtp(phoneNumber);
        if (!res)
            throw new common_1.InternalServerErrorException('Server error.');
        return {
            message: 'code sended',
        };
    }
    async verifyOtp(verifyOtpDto) {
        const key = `user:${verifyOtpDto.phone_number}`;
        const sessionToken = await this.otpService.verifyOtpSendUser(key, verifyOtpDto.code, verifyOtpDto.phone_number);
        return {
            message: 'success',
            session_token: sessionToken,
        };
    }
    async register(registerAuthDto) {
        const findUser = await this.db.prisma.user.findFirst({
            where: {
                phone_number: registerAuthDto.phone_number,
            },
        });
        if (findUser)
            throw new common_1.ConflictException('phone_number already exists.');
        const key = `session_token:${registerAuthDto.phone_number}`;
        await this.otpService.checkSessionTokenUser(key, registerAuthDto.session_token);
        const hashPassword = await bcrypt_1.default.hash(registerAuthDto.password, 12);
        const user = await this.db.prisma.user.create({
            data: {
                phone_number: registerAuthDto.phone_number,
                password: hashPassword,
                username: registerAuthDto.username,
                firstName: registerAuthDto.firstName,
                lastName: registerAuthDto.lastName,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                is_Blocked: true,
                is_phone_verified: true,
            },
        });
        const token = await this.jwtService.signAsync({
            userId: user.id,
            role: user.role,
        });
        await this.otpService.delSessionTokenUser(key);
        return { token, user };
    }
    async loginWithPhoneAndPassword(loginhoneAndPassword) {
        const findUser = await this.db.prisma.user.findFirst({
            where: { phone_number: loginhoneAndPassword.phone_number },
        });
        if (!findUser)
            throw new common_1.ConflictException('Invalid phone number or password');
        const comparePassword = await bcrypt_1.default.compare(loginhoneAndPassword.password, findUser.password);
        if (!comparePassword)
            throw new common_1.ConflictException('invalid phone number or password');
        await this.otpService.sendOtp(loginhoneAndPassword.phone_number);
        return {
            message: 'code sended',
        };
    }
    async loginCode(verifyOtpDto) {
        const key = `user:${verifyOtpDto.phone_number}`;
        await this.otpService.verifyOtpSendUser(key, verifyOtpDto.code, verifyOtpDto.phone_number);
        await this.otpService.delSessionTokenUser(key);
        const user = await this.db.prisma.user.findFirst({
            where: {
                phone_number: verifyOtpDto.phone_number,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                is_Blocked: true,
                is_phone_verified: true,
            },
        });
        const token = await this.jwtService.signAsync({
            userId: user?.id,
            role: user?.role,
        });
        return { token, user };
    }
    async loginWithPhoneNumber(loginPhoneNumberDto) {
        const findUser = await this.db.prisma.user.findFirst({
            where: { phone_number: loginPhoneNumberDto.phone_number },
        });
        if (!findUser)
            throw new common_1.ConflictException('Invalid phone number or password');
        await this.otpService.sendOtp(loginPhoneNumberDto.phone_number);
        return {
            message: 'code sended',
        };
    }
    async updateAdmin(role, id) {
        const findUser = await this.db.prisma.user.findFirst({
            where: {
                id: id,
            },
        });
        if (!findUser)
            throw new common_1.ConflictException('User id not found');
        const admin = await this.db.prisma.user.update({
            where: { id: id },
            data: {
                role: role,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                is_Blocked: true,
                is_phone_verified: true,
            },
        });
        return admin;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map