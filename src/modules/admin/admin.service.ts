import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { startOfDay } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(private readonly db: PrismaService) {}

  async getDashboardStats() {
    const now = new Date();
    const todayStart = startOfDay(now);

    const [
      totalUsers,
      totalVideos,
      totalViews,
      totalWatchTime,
      newUsersToday,
      newVideosToday,
      viewsToday,
      topCategories,
    ] = await Promise.all([
      this.db.prisma.user.count(),

      this.db.prisma.video.count(),

      this.db.prisma.view.count(),

      this.db.prisma.view.aggregate({ _sum: { watchTime: true } }),

      this.db.prisma.user.count({ where: { createdAt: { gte: todayStart } } }),

      this.db.prisma.video.count({ where: { createdAt: { gte: todayStart } } }),

      this.db.prisma.view.count({ where: { createdAt: { gte: todayStart } } }),

      this.db.prisma.video.groupBy({
        by: ['category'],

        where: { category: { not: null } },

        _count: true,

        orderBy: { _count: { category: 'desc' } },

        take: 5,
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalVideos,
        totalViews,
        totalWatchTime: totalWatchTime._sum.watchTime || 0,
        newUsersToday,
        newVideosToday,
        viewsToday,
        topCategories: topCategories.map((c) => ({
          category: c.category,
          count: c._count,
        })),
        storageUsed: '500TB',
        bandwidthUsed: '50TB',
      },
    };
  }

  async getPendingVideos(limit: number, page: number) {
    return this.db.prisma.video.findMany({
      where: {
        status: 'PROCESSING',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async approveVideo(id: string) {
    return this.db.prisma.video.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async rejectVideo(id: string) {
    return this.db.prisma.video.update({
      where: { id },
      data: { status: 'DELETED' },
    });
  }

  async getUsers(limit: number, page: number, search: string, status: string) {
    return this.db.prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
          status === 'active'
            ? { is_Blocked: false }
            : status === 'blocked'
              ? { is_Blocked: true }
              : {},
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async blockUser(id: string) {
    return this.db.prisma.user.update({
      where: { id },
      data: { is_Blocked: true },
    });
  }

  async verifyUser(id: string) {
    return this.db.prisma.user.update({
      where: { id },
      data: {
        is_email_verified: true,
        is_phone_verified: true,
      },
    });
  }
}
