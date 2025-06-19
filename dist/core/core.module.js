"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("./databases/database.module");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const nestjs_resend_1 = require("nestjs-resend");
const video_processing_service_1 = __importDefault(require("./video.processing.service"));
let CoreModule = class CoreModule {
};
exports.CoreModule = CoreModule;
exports.CoreModule = CoreModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                imports: [jwt_1.JwtModule],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_KEY'),
                    signOptions: {
                        expiresIn: '8h',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            nestjs_resend_1.ResendModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    apiKey: configService.get('RESEND_API_KEY'),
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [video_processing_service_1.default],
        exports: [video_processing_service_1.default],
    })
], CoreModule);
//# sourceMappingURL=core.module.js.map