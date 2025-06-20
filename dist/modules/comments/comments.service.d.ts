import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateCommentDto } from './dto/creatw.comment';
import { QueryCommentsDto } from './dto/query.comment';
export declare class CommentsService {
    private readonly db;
    constructor(db: PrismaService);
    addComment(videoId: string, userId: string, dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        likesCount: number;
        authorId: string;
        content: string;
        isPinned: boolean;
        videoId: string;
    }>;
    getComments(videoId: string, query: QueryCommentsDto): Promise<{
        success: boolean;
        data: {
            comments: {
                id: any;
                content: any;
                likesCount: any;
                dislikesCount: number;
                isPinned: boolean;
                createdAt: any;
                author: any;
            }[];
            totalComments: number;
            hasMore: boolean;
        };
    }>;
    togglePinComment(commentId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
