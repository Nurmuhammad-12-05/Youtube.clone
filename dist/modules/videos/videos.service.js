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
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const video_processing_service_1 = __importDefault(require("../../core/video.processing.service"));
const prisma_service_1 = require("../../core/databases/prisma.service");
let VideosService = class VideosService {
    videoProcessingService;
    db;
    constructor(videoProcessingService, db) {
        this.videoProcessingService = videoProcessingService;
        this.db = db;
    }
    async uploadVideo(file, createVideoDto) {
        const fileName = file.filename;
        const videoPath = path_1.default.join(process.cwd(), 'uploads', fileName);
        try {
            const metadata = await this.videoProcessingService.getVideoMetadata(videoPath);
            if (metadata.duration > 6000) {
                fs_1.default.unlinkSync(videoPath);
                throw new common_1.BadRequestException('Video duration should not exceed 10 minutes');
            }
            if (!metadata.hasAudio) {
                throw new common_1.BadRequestException('Video has no audio track');
            }
            const resolutions = [
                { height: 240 },
                { height: 360 },
                { height: 480 },
                { height: 720 },
                { height: 1080 },
            ];
            const validResolutions = resolutions.filter((r) => r.height <= metadata.height + 6);
            if (validResolutions.length > 0) {
                const outputDir = path_1.default.join(process.cwd(), 'uploads', 'videos', fileName.split('.')[0]);
                fs_1.default.mkdirSync(outputDir, { recursive: true });
                await Promise.all(this.videoProcessingService.convertToResolutions(videoPath, outputDir, validResolutions));
                fs_1.default.unlinkSync(videoPath);
                const video = await this.db.prisma.video.create({
                    data: {
                        title: createVideoDto.title,
                        description: createVideoDto.description,
                        videoUrl: `uploads/videos/${fileName.split('.')[0]}`,
                        duration: metadata.duration,
                        fileSize: metadata.fileSize,
                        resolution: `${metadata.width}x${metadata.height}`,
                        authorId: createVideoDto.authorId,
                        status: 'PUBLISHED',
                        availableQualities: validResolutions.map((r) => `${r.height}p`),
                    },
                });
                const estimatedTime = this.videoProcessingService.calculateProcessingTime(metadata.duration, validResolutions.length);
                return {
                    success: true,
                    message: 'Video uploaded successfully, processing started',
                    data: {
                        id: video.id,
                        title: video.title,
                        status: 'PROCESSING',
                        uploadProgress: 100,
                        processingProgress: 0,
                        estimatedProcessingTime: estimatedTime,
                        metadata: {
                            duration: metadata.durationFormatted,
                            hasAudio: metadata.hasAudio,
                            resolution: `${metadata.width}x${metadata.height}`,
                            availableQualities: validResolutions.map((r) => `${r.height}p`),
                            fileSize: `${(metadata.fileSize / 1024 / 1024).toFixed(2)} MB`,
                        },
                    },
                };
            }
            else {
                fs_1.default.unlinkSync(videoPath);
                throw new common_1.BadRequestException('Video quality is too low for processing');
            }
        }
        catch (error) {
            if (fs_1.default.existsSync(videoPath)) {
                fs_1.default.unlinkSync(videoPath);
            }
            throw error;
        }
    }
    async videoStream(id, quality, range, res) {
        const findVideo = await this.db.prisma.video.findFirst({
            where: { id: id },
        });
        if (!findVideo)
            throw new common_1.ConflictException('No such video ID exists.');
        const fileName = findVideo.videoUrl.split('/')[2];
        const baseQuality = `${quality}.mp4`;
        const basePath = path_1.default.join(process.cwd(), 'uploads', 'videos');
        const readDir = fs_1.default.readdirSync(basePath);
        if (!readDir.includes(fileName))
            throw new common_1.NotFoundException('video not found');
        const videoActivePath = path_1.default.join(basePath, fileName, baseQuality);
        const innerVideoDir = fs_1.default.readdirSync(path_1.default.join(basePath, fileName));
        if (!innerVideoDir.includes(baseQuality))
            throw new common_1.NotFoundException('video quality not found');
        const { size } = fs_1.default.statSync(videoActivePath);
        if (!range) {
            range = `bytes=0-1048575`;
        }
        const { start, end, chunkSize } = this.videoProcessingService.getChunkProps(range, size);
        const { statusCode } = res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        });
        const videoStream = fs_1.default.createReadStream(videoActivePath, {
            start,
            end,
        });
        videoStream.pipe(res);
        return {
            Status: statusCode,
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Content-Type': 'video/mp4',
        };
    }
    async getVideoStatus(id) {
        const findVideo = await this.db.prisma.video.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                status: true,
                duration: true,
                resolution: true,
                availableQualities: true,
            },
        });
        if (!findVideo)
            throw new common_1.ConflictException('No such video ID exists.');
        const estimatedTime = this.videoProcessingService.calculateProcessingTime(findVideo.duration, findVideo.resolution.length);
        const data = {
            id: findVideo.id,
            status: findVideo.status,
            processingProgress: 0,
            availableQualities: findVideo.availableQualities,
            estimatedTimeRemaining: estimatedTime,
        };
        return data;
    }
    async getVideoDetails(id) {
        const findVideo = await this.db.prisma.video.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                videoUrl: true,
                availableQualities: true,
                duration: true,
                viewsCount: true,
                likesCount: true,
                dislikesCount: true,
                _count: {
                    select: {
                        comments: true,
                    },
                },
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        channelName: true,
                        avatar: true,
                        _count: {
                            select: {
                                subscribers: true,
                            },
                        },
                        is_email_verified: true,
                    },
                },
                tags: true,
                category: true,
            },
        });
        if (!findVideo)
            throw new common_1.ConflictException('No such video ID exists.');
        const data = {
            id: findVideo.id,
            title: findVideo.title,
            description: findVideo.description,
            thumbnail: findVideo.thumbnail,
            videoUrl: findVideo.videoUrl,
            availableQualities: findVideo.availableQualities,
            duration: findVideo.duration,
            viewsCount: findVideo.viewsCount,
            likesCount: findVideo.likesCount,
            dislikesCount: findVideo.dislikesCount,
            commentsCount: findVideo._count.comments,
            publishedAt: findVideo.createdAt,
            author: {
                id: findVideo.author.id,
                username: findVideo.author.username,
                channelName: findVideo.author.channelName,
                avatar: findVideo.author.avatar,
                subscribersCount: findVideo.author._count.subscribers,
                isVerified: findVideo.author.is_email_verified,
            },
            tags: findVideo.tags,
            category: findVideo.category,
        };
        return data;
    }
    async updateVideo(updateVideo, id) {
        const findVideo = await this.db.prisma.video.update({
            where: { id: id },
            data: {
                title: updateVideo.title,
                description: updateVideo.description,
                visibility: updateVideo.visibility,
                tags: updateVideo.tags,
            },
        });
        if (!findVideo)
            throw new common_1.ConflictException('No such video ID exists.');
        return {
            message: 'Video updated.',
        };
    }
    async deleteVideo(id) {
        const findVideo = await this.db.prisma.video.delete({ where: { id: id } });
        if (!findVideo)
            throw new common_1.ConflictException('No such video ID exists.');
        return {
            message: 'Delete',
        };
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [video_processing_service_1.default,
        prisma_service_1.PrismaService])
], VideosService);
//# sourceMappingURL=videos.service.js.map