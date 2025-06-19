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
exports.VideoOwnerGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../databases/prisma.service");
let VideoOwnerGuard = class VideoOwnerGuard {
    db;
    constructor(db) {
        this.db = db;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userRole = request.role;
        const userId = request.userId;
        const videoId = request.params.id;
        if (!videoId) {
            throw new common_1.ForbiddenException('Video ID talab qilinadi');
        }
        const video = await this.db.prisma.video.findUnique({
            where: { id: videoId },
            select: { authorId: true },
        });
        if (!video) {
            throw new common_1.ForbiddenException('Video topilmadi');
        }
        if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
            return true;
        }
        if (video.authorId !== userId) {
            throw new common_1.ForbiddenException('Bu amal faqat video egasiga ruxsat etilgan');
        }
        return true;
    }
};
exports.VideoOwnerGuard = VideoOwnerGuard;
exports.VideoOwnerGuard = VideoOwnerGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoOwnerGuard);
//# sourceMappingURL=video.owner.guard.js.map