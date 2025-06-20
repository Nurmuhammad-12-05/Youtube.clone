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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const channels_service_1 = require("./channels.service");
const role_guard_1 = require("../../core/guards/role.guard");
const update_channel_1 = require("./dto/update.channel");
let ChannelsController = class ChannelsController {
    channelsService;
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async getChannelInfo(username, req) {
        const currentUserId = req['userId'];
        return this.channelsService.getChannelInfo(username, currentUserId);
    }
    async getChannelVideos(username, limit = '20', page = '1', sort = 'newest') {
        return this.channelsService.getChannelVideos({
            username,
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
        });
    }
    async updateChannel(req, body) {
        const userId = req['userId'];
        return this.channelsService.updateChannelInfo(userId, body);
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Get)('/:username'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelInfo", null);
__decorate([
    (0, common_1.Get)('/:username/videos'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('username')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getChannelVideos", null);
__decorate([
    (0, common_1.Put)('/me'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER']),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_channel_1.UpdateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "updateChannel", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, common_1.Controller)('channels'),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map