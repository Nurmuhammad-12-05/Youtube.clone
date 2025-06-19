"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bigint_interceptor_1 = require("./core/interceptors/bigint.interceptor");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.setGlobalPrefix('/api');
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        app.useGlobalInterceptors(new bigint_interceptor_1.BigIntInterceptor());
        app.use((0, cookie_parser_1.default)());
        await app.listen(process.env.PORT ?? 3000);
    }
    catch (error) {
        console.error(error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map