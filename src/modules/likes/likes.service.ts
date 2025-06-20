import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly db: PrismaService) {}

  async likeComment(
    commentId: string,
    type: 'LIKE' | 'DISLIKE',
    userId: string,
  ) {
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

  async removeCommentLike(commentId: string, userId: string) {
    const existingLike = await this.db.prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found for this comment');
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
}
