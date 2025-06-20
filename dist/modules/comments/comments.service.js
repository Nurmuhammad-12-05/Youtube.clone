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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/databases/prisma.service");
let CommentsService = class CommentsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async addComment(videoId, userId, dto) {
        const video = await this.db.prisma.video.findUnique({
            where: { id: videoId },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        const user = await this.db.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const newComment = await this.db.prisma.comment.create({
            data: {
                content: dto.content,
                authorId: userId,
                videoId,
            },
        });
        return newComment;
    }
    async getComments(videoId, query) {
        const limit = parseInt(query.limit) || 20;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        let orderBy;
        switch (query.sort) {
            case 'new':
                orderBy = { createdAt: 'desc' };
                break;
            case 'old':
                orderBy = { createdAt: 'asc' };
                break;
            case 'top':
            default:
                orderBy = { likesCount: 'desc' };
                break;
        }
        const [comments, totalComments] = await this.db.prisma.$transaction([
            this.db.prisma.comment.findMany({
                where: { videoId },
                skip,
                take: limit,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                        },
                    },
                },
            }),
            this.db.prisma.comment.count({ where: { videoId } }),
        ]);
        const formatted = await Promise.all(comments.map(async (comment) => {
            const dislikesCount = await this.db.prisma.like.count({
                where: {
                    commentId: comment.id,
                    type: 'DISLIKE',
                },
            });
            return {
                id: comment.id,
                content: comment.content,
                likesCount: comment.likesCount,
                dislikesCount,
                isPinned: false,
                createdAt: comment.createdAt,
                author: comment.author,
            };
        }));
        return {
            success: true,
            data: {
                comments: formatted,
                totalComments,
                hasMore: skip + limit < totalComments,
            },
        };
    }
    async togglePinComment(commentId, userId) {
        const comment = await this.db.prisma.comment.findUnique({
            where: { id: commentId },
            include: { video: true },
        });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        const video = await this.db.prisma.video.findUnique({
            where: { id: comment.videoId },
        });
        console.log(video, userId);
        if (!video || video.authorId !== userId) {
            throw new common_1.ForbiddenException('Only video author can pin/unpin comments');
        }
        const updatedComment = await this.db.prisma.comment.update({
            where: { id: commentId },
            data: {
                isPinned: !comment.isPinned,
            },
        });
        return {
            success: true,
            message: updatedComment.isPinned
                ? 'Comment pinned successfully'
                : 'Comment unpinned successfully',
        };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map