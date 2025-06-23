import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../databases/prisma.service';

@Injectable()
export class VideoOwnerGuard implements CanActivate {
  constructor(private readonly db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userRole = request.role;

    const userId = request.userId;

    const videoId = request.params.id;

    if (!videoId) {
      throw new ForbiddenException('Video ID talab qilinadi');
    }

    const video = await this.db.prisma.video.findUnique({
      where: { id: videoId },
      select: { authorId: true },
    });

    if (!video) {
      throw new ForbiddenException('Video topilmadi');
    }

    if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      return true;
    }

    if (video.authorId !== userId) {
      throw new ForbiddenException(
        'Bu amal faqat video egasiga ruxsat etilgan',
      );
    }

    return true;
  }
}
