import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreateCommentDto } from './dto/creatw.comment';
import { QueryCommentsDto } from './dto/query.comment';

@Injectable()
export class CommentsService {
  constructor(private readonly db: PrismaService) {}

  async addComment(videoId: string, userId: string, dto: CreateCommentDto) {
    const video = await this.db.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    const user = await this.db.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

  async getComments(videoId: string, query: QueryCommentsDto) {
    const limit = parseInt(query.limit as string) || 20;
    const page = parseInt(query.page as string) || 1;
    const skip = (page - 1) * limit;

    let orderBy: any;

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

    const formatted = await Promise.all(
      comments.map(async (comment: any) => {
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
      }),
    );

    return {
      success: true,
      data: {
        comments: formatted,
        totalComments,
        hasMore: skip + limit < totalComments,
      },
    };
  }

  async togglePinComment(commentId: string, userId: string) {
    const comment = await this.db.prisma.comment.findUnique({
      where: { id: commentId },
      include: { video: true },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    const video = await this.db.prisma.video.findUnique({
      where: { id: comment.videoId },
    });

    console.log(video, userId);

    if (!video || video.authorId !== userId) {
      throw new ForbiddenException('Only video author can pin/unpin comments');
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
}
