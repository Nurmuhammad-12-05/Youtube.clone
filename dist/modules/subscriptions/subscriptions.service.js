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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/databases/prisma.service");
let SubscriptionsService = class SubscriptionsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async subscribe(userId, channelId) {
        if (userId === channelId) {
            throw new common_1.BadRequestException('You cannot subscribe to yourself');
        }
        try {
            const subscription = await this.db.prisma.subscription.create({
                data: {
                    subscriptionId: userId,
                    channeId: channelId,
                },
            });
            return { success: true, data: subscription };
        }
        catch (e) {
            throw new common_1.ConflictException('Already subscribed');
        }
        throw new common_1.InternalServerErrorException('Internal server error');
    }
    async unsubscribe(userId, channelId) {
        const { count } = await this.db.prisma.subscription.deleteMany({
            where: { subscriptionId: userId, channeId: channelId },
        });
        if (count === 0)
            throw new common_1.NotFoundException('Subscription not found');
        return { message: 'Delete subscription' };
    }
    async getSubscriptions(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await this.db.prisma.$transaction([
            this.db.prisma.subscription.findMany({
                skip,
                take: limit,
                include: {
                    subscriber: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                    channel: {
                        select: {
                            id: true,
                            username: true,
                            channelName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.db.prisma.subscription.count(),
        ]);
        return {
            total,
            page,
            limit,
            data,
        };
    }
    async getSubscriptionFeed(userId, page, limit) {
        const skip = (page - 1) * limit;
        const subscriptions = await this.db.prisma.subscription.findMany({
            where: {
                subscriptionId: userId,
            },
            select: {
                channeId: true,
            },
        });
        const channelIds = subscriptions.map((sub) => sub.channeId);
        const [videos, total] = await this.db.prisma.$transaction([
            this.db.prisma.video.findMany({
                where: {
                    authorId: {
                        in: channelIds,
                    },
                    visibility: 'PUBLIC',
                    status: 'PUBLISHED',
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            channelName: true,
                        },
                    },
                },
            }),
            this.db.prisma.video.count({
                where: {
                    authorId: {
                        in: channelIds,
                    },
                    visibility: 'PUBLIC',
                    status: 'PUBLISHED',
                },
            }),
        ]);
        return {
            total,
            page,
            limit,
            data: videos,
        };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map