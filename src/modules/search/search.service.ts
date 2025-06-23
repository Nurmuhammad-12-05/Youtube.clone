import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { SearchSuggestionDto } from './dto/search.query';
import { RecommendationQueryDto } from './dto/recommendation.query';

@Injectable()
export class SearchService {
  constructor(private readonly db: PrismaService) {}

  async getSuggestions(query: SearchSuggestionDto) {
    const { q = '' } = query;

    if (!q || q.trim() === '') {
      return { success: true, data: [] };
    }

    const searchText = q.trim();

    const [videoTitles, playlistTitles, channelNames] = await Promise.all([
      this.db.prisma.video.findMany({
        where: {
          title: { contains: searchText, mode: 'insensitive' },
        },
        select: { title: true },
        take: 5,
      }),
      this.db.prisma.playlist.findMany({
        where: {
          title: { contains: searchText, mode: 'insensitive' },
          visibility: 'PUBLIC',
        },
        select: { title: true },
        take: 5,
      }),
      this.db.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchText, mode: 'insensitive' } },
            { channelName: { contains: searchText, mode: 'insensitive' } },
          ],
        },
        select: {
          username: true,
          channelName: true,
        },
        take: 5,
      }),
    ]);

    const suggestions = [
      ...videoTitles.map((v) => v.title),
      ...playlistTitles.map((p) => p.title),
      ...channelNames.map((c) => c.channelName || c.username),
    ];

    const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 10);

    return {
      success: true,
      data: uniqueSuggestions,
    };
  }

  async getRecommendations(query: RecommendationQueryDto) {
    const { videoId, limit = '20', page = '1' } = query;

    const take = parseInt(limit);

    const skip = (parseInt(page) - 1) * take;

    const currentVideo = await this.db.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!currentVideo) {
      throw new NotFoundException('Video not found');
    }

    const { category, tags, authorId } = currentVideo;

    const recommendedVideos = await this.db.prisma.video.findMany({
      where: {
        id: { not: videoId },
        visibility: 'PUBLIC',
        status: 'PUBLISHED',
        OR: [
          { category: category || undefined },
          { tags: { hasSome: tags } },
          { authorId },
        ],
      },
      orderBy: {
        viewsCount: 'desc',
      },
      take,
      skip,
    });

    return {
      success: true,
      data: recommendedVideos,
    };
  }
}
