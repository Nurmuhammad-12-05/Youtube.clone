import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/databases/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly db: PrismaService) {}

  async subscribe(userId: string, channelId: string) {
    if (userId === channelId) {
      throw new BadRequestException('You cannot subscribe to yourself');
    }
    try {
      const subscription = await this.db.prisma.subscription.create({
        data: {
          subscriptionId: userId,
          channeId: channelId,
        },
      });

      return { success: true, data: subscription };
    } catch (e) {
      throw new ConflictException('Already subscribed');
    }
    throw new InternalServerErrorException('Internal server error');
  }

  async unsubscribe(userId: string, channelId: string) {
    const { count } = await this.db.prisma.subscription.deleteMany({
      where: { subscriptionId: userId, channeId: channelId },
    });

    if (count === 0) throw new NotFoundException('Subscription not found');

    return { message: 'Delete subscription' };
  }

  async getSubscriptions(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.db.prisma.$transaction([
      this.db.prisma.subscription.findMany({
        skip,
        take: limit,
        include: {
          subscriber: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          channel: {
            select: {
              id: true,
              username: true,
              channelName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.db.prisma.subscription.count(),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async getSubscriptionFeed(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const subscriptions = await this.db.prisma.subscription.findMany({
      where: {
        subscriptionId: userId,
      },
      select: {
        channeId: true,
      },
    });

    const channelIds = subscriptions.map((sub) => sub.channeId);

    const [videos, total] = await this.db.prisma.$transaction([
      this.db.prisma.video.findMany({
        where: {
          authorId: {
            in: channelIds,
          },
          visibility: 'PUBLIC',
          status: 'PUBLISHED',
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
              channelName: true,
            },
          },
        },
      }),
      this.db.prisma.video.count({
        where: {
          authorId: {
            in: channelIds,
          },
          visibility: 'PUBLIC',
          status: 'PUBLISHED',
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      data: videos,
    };
  }
}
