import { CommentsService } from './comments.service';
import { Request } from 'express';
import { CreateCommentDto } from './dto/creatw.comment';
import { QueryCommentsDto } from './dto/query.comment';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    addComment(videoId: string, dto: CreateCommentDto, req: Request): Promise<{
        id: string;
        createdAt: Date;
        likesCount: number;
        authorId: string;
        content: string;
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
}
