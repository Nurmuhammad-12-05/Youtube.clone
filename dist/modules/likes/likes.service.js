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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/databases/prisma.service");
let LikesService = class LikesService {
    db;
    constructor(db) {
        this.db = db;
    }
    async likeComment(commentId, type, userId) {
        const existingLike = await this.db.prisma.like.findFirst({
            where: {
                commentId,
                userId,
            },
        });
        if (existingLike?.type === type) {
            await this.db.prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            await this.db.prisma.comment.update({
                where: { id: commentId },
                data: {
                    likesCount: {
                        decrement: type === 'LIKE' ? 1 : 0,
                    },
                },
            });
            return { success: true, message: 'Like removed' };
        }
        if (existingLike) {
            await this.db.prisma.like.update({
                where: { id: existingLike.id },
                data: { type },
            });
            return { success: true, message: 'Like updated' };
        }
        await this.db.prisma.like.create({
            data: {
                type,
                user: { connect: { id: userId } },
                comment: { connect: { id: commentId } },
            },
        });
        if (type === 'LIKE') {
            await this.db.prisma.comment.update({
                where: { id: commentId },
                data: {
                    likesCount: {
                        increment: 1,
                    },
                },
            });
        }
        return { success: true, message: 'To like' };
    }
    async removeCommentLike(commentId, userId) {
        const existingLike = await this.db.prisma.like.findFirst({
            where: {
                commentId,
                userId,
            },
        });
        if (!existingLike) {
            throw new common_1.NotFoundException('Like not found for this comment');
        }
        await this.db.prisma.like.delete({
            where: { id: existingLike.id },
        });
        if (existingLike.type === 'LIKE') {
            await this.db.prisma.comment.update({
                where: { id: commentId },
                data: {
                    likesCount: { decrement: 1 },
                },
            });
        }
        return { success: true, message: 'Like removed successfully' };
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LikesService);
//# sourceMappingURL=likes.service.js.map