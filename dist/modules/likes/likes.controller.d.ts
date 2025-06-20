import { LikesService } from './likes.service';
import { CommentLikeDto } from './dto/comment.leki';
import { Request } from 'express';
export declare class LikesController {
    private readonly likesService;
    constructor(likesService: LikesService);
    likeComment(commentId: string, dto: CommentLikeDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    removeCommentLike(commentId: string, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
