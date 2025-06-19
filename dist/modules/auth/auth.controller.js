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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_auth_dto_1 = require("./dto/create.auth.dto");
const verify_otp_dto_1 = require("./dto/verify.otp.dto");
const register_dto_1 = require("./dto/register.dto");
const login_phone_password_dto_1 = require("./dto/login.phone.password.dto");
const login_phone_dto_1 = require("./dto/login.phone.dto");
const role_guard_1 = require("../../core/guards/role.guard");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async sendOtpUser(createAuthDto) {
        const response = await this.authService.sendOtpUser(createAuthDto);
        return response;
    }
    async verifyOtp(verifyOtpDto) {
        const result = await this.authService.verifyOtp(verifyOtpDto);
        return result;
    }
    async register(registerAuthDto, res) {
        const { token, user } = await this.authService.register(registerAuthDto);
        res.cookie('token', token, {
            maxAge: 1.1 * 3600 * 1000,
            httpOnly: true,
        });
        return {
            message: 'Muvaffaqiyatli ro‘yxatdan o‘tildi',
            user,
            token,
        };
    }
    async loginWithPhoneAndPassword(loginhoneAndPassword) {
        const response = await this.authService.loginWithPhoneAndPassword(loginhoneAndPassword);
        return response;
    }
    async loginCode(verifyOtpDto, res) {
        const { token, user } = await this.authService.loginCode(verifyOtpDto);
        res.cookie('token', token, {
            maxAge: 1.1 * 3600 * 1000,
            httpOnly: true,
        });
        return {
            message: 'Muvaffaqiyatli kirildi',
            user,
            token,
        };
    }
    async loginWithPhoneNumber(loginPhoneNumberDto) {
        const response = await this.authService.loginWithPhoneNumber(loginPhoneNumberDto);
        return response;
    }
    async logout(response) {
        try {
            response.setHeader('Set-Cookie', `token=; Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`);
            return {
                message: 'Muvaffaqiyatli tizimdan chiqildi',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, 500);
        }
    }
    async addAdmin(role, id) {
        try {
            const admin = await this.authService.updateAdmin(role, id);
            return {
                message: 'Admin qoshildi.',
                admin,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException(error.message, 500);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/send-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_auth_dto_1.CreateAuthDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendOtpUser", null);
__decorate([
    (0, common_1.Post)('/verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterAuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login-phone-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_phone_password_dto_1.LoginPhoneAndPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithPhoneAndPassword", null);
__decorate([
    (0, common_1.Post)('/login-check-code'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginCode", null);
__decorate([
    (0, common_1.Post)('/login-phone-number'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_phone_dto_1.LoginPhoneNumberDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginWithPhoneNumber", null);
__decorate([
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Put)('/admin/:id'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('isAdmin', true),
    (0, common_1.SetMetadata)('role', ['SUPERADMIN']),
    __param(0, (0, common_1.Body)('role')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "addAdmin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.SetMetadata)('isPublic', true),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map