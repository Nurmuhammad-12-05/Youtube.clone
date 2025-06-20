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
exports.ChannelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/databases/prisma.service");
const client_1 = require("@prisma/client");
const path_1 = __importDefault(require("path"));
let ChannelsService = class ChannelsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getChannelInfo(username, currentUserId) {
        const user = await this.db.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                channelName: true,
                channelDescription: true,
                avatar: true,
                createdAt: true,
                is_email_verified: true,
                subscribers: true,
                videos: {
                    select: { id: true },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Channel not found');
        const videosCount = user.videos.length;
        const subscribersCount = await this.db.prisma.subscription.count({
            where: { channeId: user.id },
        });
        const totalViewsRaw = await this.db.prisma.video.aggregate({
            where: { authorId: user.id, status: 'PUBLISHED', visibility: 'PUBLIC' },
            _sum: { viewsCount: true },
        });
        const totalViews = totalViewsRaw._sum.viewsCount ?? BigInt(0);
        let isSubscribed = false;
        if (currentUserId) {
            const sub = await this.db.prisma.subscription.findUnique({
                where: {
                    subscriptionId_channeId: {
                        subscriptionId: currentUserId,
                        channeId: user.id,
                    },
                },
            });
            isSubscribed = !!sub;
        }
        return {
            success: true,
            data: {
                id: user.id,
                username: user.username,
                channelName: user.channelName,
                channelDescription: user.channelDescription,
                avatar: user.avatar,
                channelBanner: null,
                subscribersCount,
                totalViews: totalViews.toString(),
                videosCount,
                joinedAt: user.createdAt,
                isVerified: user.is_email_verified,
                isSubscribed,
            },
        };
    }
    async getChannelVideos(params) {
        const { username, limit, page, sort } = params;
        const skip = limit * (page - 1);
        const user = await this.db.prisma.user.findUnique({
            where: { username },
            select: { id: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Channel not found');
        const orderBy = sort === 'oldest'
            ? { createdAt: client_1.Prisma.SortOrder.asc }
            : sort === 'most_viewed'
                ? { viewsCount: client_1.Prisma.SortOrder.desc }
                : { createdAt: client_1.Prisma.SortOrder.desc };
        const [videos, totalCount] = await Promise.all([
            this.db.prisma.video.findMany({
                where: {
                    authorId: user.id,
                    status: 'PUBLISHED',
                    visibility: 'PUBLIC',
                },
                skip,
                take: limit,
                orderBy,
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    duration: true,
                    viewsCount: true,
                    likesCount: true,
                    createdAt: true,
                },
            }),
            this.db.prisma.video.count({
                where: {
                    authorId: user.id,
                    status: 'PUBLISHED',
                    visibility: 'PUBLIC',
                },
            }),
        ]);
        return {
            videos: videos.map((v) => ({
                ...v,
                viewsCount: v.viewsCount.toString(),
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                hasNext: page * limit < totalCount,
                hasPrev: page > 1,
            },
        };
    }
    async updateChannelInfo(userId, data) {
        const user = await this.db.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const filePath = path_1.default.join('uploads', 'banerimag', 'pubg.jpg');
        const normalizedPath = filePath.replace(/\\/g, '/');
        const channelBanner = `http://localhost:4000/channel/banner/${normalizedPath}`;
        data.channelBanner = channelBanner;
        const updated = await this.db.prisma.user.update({
            where: { id: userId },
            data: {
                channelName: data.channelName,
                channelDescription: data.channelDescription,
                channelBanner: data.channelBanner,
            },
            select: {
                id: true,
                channelName: true,
                channelDescription: true,
                avatar: true,
                channelBanner: true,
            },
        });
        return {
            success: true,
            data: updated,
        };
    }
};
exports.ChannelsService = ChannelsService;
exports.ChannelsService = ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelsService);
//# sourceMappingURL=channels.service.js.map