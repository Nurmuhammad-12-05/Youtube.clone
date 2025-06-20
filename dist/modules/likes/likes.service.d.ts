import { PrismaService } from 'src/core/databases/prisma.service';
export declare class LikesService {
    private readonly db;
    constructor(db: PrismaService);
    likeComment(commentId: string, type: 'LIKE' | 'DISLIKE', userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    removeCommentLike(commentId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
