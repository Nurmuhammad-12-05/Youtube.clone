import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { Prisma } from '@prisma/client';
import { UpdateChannelDto } from './dto/update.channel';
import path from 'path';

@Injectable()
export class ChannelsService {
  constructor(private readonly db: PrismaService) {}

  async getChannelInfo(username: string, currentUserId?: string) {
    const user = await this.db.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        channelName: true,
        channelDescription: true,
        avatar: true,
        createdAt: true,
        is_email_verified: true,
        subscribers: true,
        videos: {
          select: { id: true },
        },
      },
    });

    if (!user) throw new NotFoundException('Channel not found');

    const videosCount = user.videos.length;

    const subscribersCount = await this.db.prisma.subscription.count({
      where: { channeId: user.id },
    });

    const totalViewsRaw = await this.db.prisma.video.aggregate({
      where: { authorId: user.id, status: 'PUBLISHED', visibility: 'PUBLIC' },
      _sum: { viewsCount: true },
    });

    const totalViews = totalViewsRaw._sum.viewsCount ?? BigInt(0);

    let isSubscribed = false;

    if (currentUserId) {
      const sub = await this.db.prisma.subscription.findUnique({
        where: {
          subscriptionId_channeId: {
            subscriptionId: currentUserId,
            channeId: user.id,
          },
        },
      });

      isSubscribed = !!sub;
    }

    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        channelName: user.channelName,
        channelDescription: user.channelDescription,
        avatar: user.avatar,
        channelBanner: null,
        subscribersCount,
        totalViews: totalViews.toString(),
        videosCount,
        joinedAt: user.createdAt,
        isVerified: user.is_email_verified,
        isSubscribed,
      },
    };
  }

  async getChannelVideos(params: {
    username: string;
    limit: number;
    page: number;
    sort: 'newest' | 'oldest' | 'most_viewed';
  }) {
    const { username, limit, page, sort } = params;

    const skip = limit * (page - 1);

    const user = await this.db.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('Channel not found');

    const orderBy: Record<string, Prisma.SortOrder> =
      sort === 'oldest'
        ? { createdAt: Prisma.SortOrder.asc }
        : sort === 'most_viewed'
          ? { viewsCount: Prisma.SortOrder.desc }
          : { createdAt: Prisma.SortOrder.desc };

    const [videos, totalCount] = await Promise.all([
      this.db.prisma.video.findMany({
        where: {
          authorId: user.id,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          thumbnail: true,
          duration: true,
          viewsCount: true,
          likesCount: true,
          createdAt: true,
        },
      }),

      this.db.prisma.video.count({
        where: {
          authorId: user.id,
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
        },
      }),
    ]);

    return {
      videos: videos.map((v) => ({
        ...v,
        viewsCount: v.viewsCount.toString(),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };
  }

  async updateChannelInfo(userId: string, data: UpdateChannelDto) {
    const user = await this.db.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const updated = await this.db.prisma.user.update({
      where: { id: userId },
      data: {
        channelName: data.channelName,
        channelDescription: data.channelDescription,
        channelBanner: data.channelBanner,
      },
      select: {
        id: true,
        channelName: true,
        channelDescription: true,
        avatar: true,
        channelBanner: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }
}
