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
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const endipoints_1 = __importDefault(require("../../common/constants/endipoints"));
const axios_1 = __importDefault(require("axios"));
let SmsService = class SmsService {
    configService;
    email;
    password;
    constructor(configService) {
        this.configService = configService;
        this.email = configService.get('ESKIZ_EMAIL');
        this.password = configService.get('ESKIZ_PASSWORD');
    }
    async getToken() {
        try {
            const url = endipoints_1.default.getEskizTokenUrl();
            const formData = new FormData();
            formData.set('email', this.email);
            formData.set('password', this.password);
            const { data: { data: { token }, }, } = await axios_1.default.post(url, formData, {
                headers: {
                    'Content-Type': 'multirpart/form-data',
                },
            });
            return token;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async sendSms(phone_number, otp) {
        const url = endipoints_1.default.sendSmsUrl();
        const token = await this.getToken();
        const formData = new FormData();
        formData.set('mobile_phone', phone_number);
        formData.set('message', `StudyHub ilovasiga kirish kodi:${otp}`);
        formData.set('from', '4546');
        const { status } = await axios_1.default.post(url, formData, {
            headers: {
                'Content-Type': 'multirpart/from-data',
                Authorization: `Bearer ${token}`,
            },
        });
        if (status !== 200)
            throw new common_1.InternalServerErrorException('Server error');
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map