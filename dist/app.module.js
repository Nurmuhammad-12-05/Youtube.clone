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
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_module_1 = require("./core/core.module");
const core_1 = require("@nestjs/core");
const transform_interceptor_1 = __importDefault(require("./core/interceptors/transform.interceptor"));
const auth_guard_1 = require("./core/guards/auth.guard");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const videos_module_1 = require("./modules/videos/videos.module");
const comments_module_1 = require("./modules/comments/comments.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const playlist_module_1 = require("./modules/playlist/playlist.module");
const likes_module_1 = require("./modules/likes/likes.module");
const profile_module_1 = require("./modules/profile/profile.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const channels_module_1 = require("./modules/channels/channels.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            core_module_1.CoreModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            videos_module_1.VideosModule,
            comments_module_1.CommentsModule,
            subscriptions_module_1.SubscriptionsModule,
            playlist_module_1.PlaylistModule,
            likes_module_1.LikesModule,
            profile_module_1.ProfileModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
            }),
            channels_module_1.ChannelsModule,
            analytics_module_1.AnalyticsModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.default,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map