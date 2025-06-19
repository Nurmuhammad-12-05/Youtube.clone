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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const videos_service_1 = require("./videos.service");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const create_video_1 = require("./dto/create.video");
const update_video_1 = require("./dto/update.video");
const role_guard_1 = require("../../core/guards/role.guard");
const video_owner_guard_1 = require("../../core/guards/video.owner.guard");
let VideosController = class VideosController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    async uploadVideo(file, createVideoDto) {
        if (!file)
            throw new common_1.BadRequestException('File not found');
        const data = await this.videoService.uploadVideo(file, createVideoDto);
        return data;
    }
    async videoStream(id, quality, res, req) {
        const param = id;
        const contentRange = req.headers.Range;
        await this.videoService.videoStream(param, quality, contentRange, res);
    }
    async getVideoStatus(id) {
        const param = id;
        const data = await this.videoService.getVideoStatus(id);
        return { data };
    }
    async getVideoDetails(id) {
        const param = id;
        const data = await this.videoService.getVideoDetails(id);
        return { data };
    }
    async updateVideo(updateVideo, id) {
        return await this.videoService.updateVideo(updateVideo, id);
    }
    async deleteVideo(id) {
        return await this.videoService.deleteVideo(id);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads',
            filename: (req, file, callback) => {
                const mimeType = path_1.default.extname(file.originalname);
                const fileName = `${(0, uuid_1.v4)()}${mimeType}`;
                callback(null, fileName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_video_1.CreateVideoDto]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Get)('/:id/stream'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('quality')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "videoStream", null);
__decorate([
    (0, common_1.Get)('/:id/status'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideoStatus", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getVideoDetails", null);
__decorate([
    (0, common_1.Put)('/:id'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard, video_owner_guard_1.VideoOwnerGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_video_1.UpdateVideoDto, String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "updateVideo", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    (0, common_1.UseGuards)(role_guard_1.RoleGuard, video_owner_guard_1.VideoOwnerGuard),
    (0, common_1.SetMetadata)('role', ['USER', 'ADMIN', 'SUPERADMIN']),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "deleteVideo", null);
exports.VideosController = VideosController = __decorate([
    (0, common_1.Controller)('/videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map