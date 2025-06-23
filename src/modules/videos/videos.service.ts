import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import VideoProcessingService from 'src/core/video.processing.service';
import { CreateVideoDto } from './dto/create.video';
import { PrismaService } from 'src/core/databases/prisma.service';
import { VideoMetadata } from 'src/common/interfaces/interface';
import { UpdateVideoDto } from './dto/update.video';
import { DurationEnum, GetFeedDto } from './dto/video.feed';
import { VideoStatus, View, Visibility } from '@prisma/client';
import { CreateViewDto } from './dto/create.view';

@Injectable()
export class VideosService {
  constructor(
    private videoProcessingService: VideoProcessingService,
    private readonly db: PrismaService,
  ) {}

  async uploadVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto) {
    const fileName = file.filename;

    const videoPath = path.join(process.cwd(), 'uploads', fileName);

    try {
      const metadata: VideoMetadata =
        await this.videoProcessingService.getVideoMetadata(videoPath);

      if (metadata.duration > 6000) {
        fs.unlinkSync(videoPath);
        throw new BadRequestException(
          'Video duration should not exceed 10 minutes',
        );
      }

      if (!metadata.hasAudio) {
        throw new BadRequestException('Video has no audio track');
      }

      const resolutions = [
        { height: 240 },
        { height: 360 },
        { height: 480 },
        { height: 720 },
        { height: 1080 },
      ];

      const validResolutions = resolutions.filter(
        (r) => r.height <= metadata.height + 6,
      );

      if (validResolutions.length > 0) {
        const outputDir = path.join(
          process.cwd(),
          'uploads',
          'videos',
          fileName.split('.')[0],
        );

        fs.mkdirSync(outputDir, { recursive: true });

        await Promise.all(
          this.videoProcessingService.convertToResolutions(
            videoPath,
            outputDir,
            validResolutions,
          ),
        );

        fs.unlinkSync(videoPath);

        const video = await this.db.prisma.video.create({
          data: {
            title: createVideoDto.title,
            description: createVideoDto.description,
            videoUrl: `uploads/videos/${fileName.split('.')[0]}`,
            duration: metadata.duration,
            fileSize: metadata.fileSize,
            resolution: `${metadata.width}x${metadata.height}`,
            authorId: createVideoDto.authorId,
            status: 'PUBLISHED',
            availableQualities: validResolutions.map((r) => `${r.height}p`),
          },
        });

        const estimatedTime =
          this.videoProcessingService.calculateProcessingTime(
            metadata.duration,
            validResolutions.length,
          );

        return {
          success: true,
          message: 'Video uploaded successfully, processing started',
          data: {
            id: video.id,
            title: video.title,
            status: 'PROCESSING',
            uploadProgress: 100,
            processingProgress: 0,
            estimatedProcessingTime: estimatedTime,
            metadata: {
              duration: metadata.durationFormatted,
              hasAudio: metadata.hasAudio,
              resolution: `${metadata.width}x${metadata.height}`,
              availableQualities: validResolutions.map((r) => `${r.height}p`),
              fileSize: `${(metadata.fileSize / 1024 / 1024).toFixed(2)} MB`,
            },
          },
        };
      } else {
        fs.unlinkSync(videoPath);
        throw new BadRequestException(
          'Video quality is too low for processing',
        );
      }
    } catch (error) {
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      throw error;
    }
  }

  async videoStream(id: string, quality: string, range: string, res: Response) {
    const findVideo = await this.db.prisma.video.findFirst({
      where: { id: id },
    });

    if (!findVideo) throw new ConflictException('No such video ID exists.');

    const fileName = findVideo.videoUrl.split('/')[2];

    const baseQuality = `${quality}.mp4`;

    const basePath = path.join(process.cwd(), 'uploads', 'videos');

    const readDir = fs.readdirSync(basePath);

    if (!readDir.includes(fileName))
      throw new NotFoundException('video not found');

    const videoActivePath = path.join(basePath, fileName, baseQuality);

    const innerVideoDir = fs.readdirSync(path.join(basePath, fileName));

    if (!innerVideoDir.includes(baseQuality))
      throw new NotFoundException('video quality not found');

    const { size } = fs.statSync(videoActivePath);

    if (!range) {
      range = `bytes=0-1048575`;
    }

    const { start, end, chunkSize } = this.videoProcessingService.getChunkProps(
      range,
      size,
    );

    const { statusCode } = res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    const videoStream = fs.createReadStream(videoActivePath, {
      start,
      end,
    });

    videoStream.pipe(res);

    return {
      Status: statusCode,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Type': 'video/mp4',
    };
  }

  async getVideoStatus(id: string) {
    const findVideo = await this.db.prisma.video.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        status: true,
        duration: true,
        resolution: true,
        availableQualities: true,
      },
    });

    if (!findVideo) throw new ConflictException('No such video ID exists.');

    const estimatedTime = this.videoProcessingService.calculateProcessingTime(
      findVideo.duration,
      findVideo.resolution.length,
    );

    const data = {
      id: findVideo.id,
      status: findVideo.status,
      processingProgress: 0,
      availableQualities: findVideo.availableQualities,
      estimatedTimeRemaining: estimatedTime,
    };

    return data;
  }

  async getVideoDetails(id: string) {
    const findVideo = await this.db.prisma.video.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        videoUrl: true,
        availableQualities: true,
        duration: true,
        viewsCount: true,
        likesCount: true,
        dislikesCount: true,
        _count: {
          select: {
            comments: true,
          },
        },
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            channelName: true,
            avatar: true,
            _count: {
              select: {
                subscribers: true,
              },
            },
            is_email_verified: true,
          },
        },
        tags: true,
        category: true,
      },
    });

    if (!findVideo) throw new ConflictException('No such video ID exists.');

    const data = {
      id: findVideo.id,
      title: findVideo.title,
      description: findVideo.description,
      thumbnail: findVideo.thumbnail,
      videoUrl: findVideo.videoUrl,
      availableQualities: findVideo.availableQualities,
      duration: findVideo.duration,
      viewsCount: findVideo.viewsCount,
      likesCount: findVideo.likesCount,
      dislikesCount: findVideo.dislikesCount,
      commentsCount: findVideo._count.comments,
      publishedAt: findVideo.createdAt,
      author: {
        id: findVideo.author.id,
        username: findVideo.author.username,
        channelName: findVideo.author.channelName,
        avatar: findVideo.author.avatar,
        subscribersCount: findVideo.author._count.subscribers,
        isVerified: findVideo.author.is_email_verified,
      },
      tags: findVideo.tags,
      category: findVideo.category,
    };

    return data;
  }

  async updateVideo(updateVideo: UpdateVideoDto, id: string) {
    const findVideo = await this.db.prisma.video.update({
      where: { id: id },
      data: {
        title: updateVideo.title,
        description: updateVideo.description,
        visibility: updateVideo.visibility,
        tags: updateVideo.tags,
      },
    });

    if (!findVideo) throw new ConflictException('No such video ID exists.');

    return {
      message: 'Video updated.',
    };
  }

  async deleteVideo(id: string) {
    const findVideo = await this.db.prisma.video.delete({ where: { id: id } });

    if (!findVideo) throw new ConflictException('No such video ID exists.');

    return {
      message: 'Delete',
    };
  }

  async getFeed(opts: GetFeedDto) {
    const { limit, page, category, duration, sort } = opts;
    const where: any = { visibility: 'PUBLIC', status: 'PUBLISHED' };

    if (category) where.category = category;

    if (duration) {
      if (duration === DurationEnum.short) where.duration = { lt: 240 };
      if (duration === DurationEnum.medium)
        where.duration = { gte: 240, lte: 1200 };
      if (duration === DurationEnum.long) where.duration = { gt: 1200 };
    }

    let orderBy: any = { createdAt: 'desc' };

    switch (sort) {
      case 'popular':
        orderBy = { likesCount: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'most_viewed':
        orderBy = { viewsCount: 'desc' };
        break;
    }

    const videos = await this.db.prisma.video.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        thumbnail: true,
        duration: true,
        viewsCount: true,
        likesCount: true,
        createdAt: true,
        category: true,
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            channelName: true,
          },
        },
      },
    });

    return videos;
  }

  async recordView(videoId: string, dto: CreateViewDto, userId?: string) {
    const video = await this.db.prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) throw new NotFoundException('Video topilmadi');

    await this.db.prisma.view.create({
      data: {
        videoId,
        userId,
        watchTime: dto.watchTime,
        quality: dto.quality,
        device: dto.device,
        location: dto.location,
      },
    });

    if (userId) {
      await this.db.prisma.watchHistory.upsert({
        where: {
          userId_videoId: {
            userId,
            videoId,
          },
        },
        update: {
          watchTime: dto.watchTime,
          watchedAt: new Date(),
        },
        create: {
          userId,
          videoId,
          watchTime: dto.watchTime,
        },
      });
    }

    await this.db.prisma.video.update({
      where: { id: videoId },
      data: {
        viewsCount: { increment: 1 },
      },
    });

    return { message: 'View recorded' };
  }

  async getAnalytics(videoId: string, timeframe: string, userId: string) {
    const video = await this.db.prisma.video.findUnique({
      where: { id: videoId },
      select: { authorId: true },
    });

    if (!video || video.authorId !== userId) {
      throw new ForbiddenException('Siz bu videoning egasi emassiz');
    }

    const now = new Date();

    const fromDate = new Date();

    const days = parseInt(timeframe.replace('d', '')) || 7;

    fromDate.setDate(now.getDate() - days);

    const views = await this.db.prisma.view.findMany({
      where: {
        videoId,
        createdAt: { gte: fromDate },
      },
    });

    const totalViews = views.length;

    const totalWatchTime = views.reduce((sum, v) => sum + v.watchTime, 0);

    const averageViewDuration = totalViews
      ? Math.round(totalWatchTime / totalViews)
      : 0;

    const viewsByDay = this.groupByDay(views);

    const viewsByCountry = this.groupByCountry(views);

    const deviceBreakdown = this.groupByDevice(views);

    const retention = this.generateRetentionChart(views);

    return {
      success: true,
      data: {
        totalViews,
        totalWatchTime,
        averageViewDuration,
        viewsByDay,
        viewsByCountry,
        deviceBreakdown,
        retention,
      },
    };
  }

  groupByDay(views: View[]) {
    const map = new Map<string, { views: number; watchTime: number }>();

    for (const view of views) {
      const date = view.createdAt.toISOString().split('T')[0];

      if (!map.has(date)) {
        map.set(date, { views: 0, watchTime: 0 });
      }

      map.get(date)!.views++;

      map.get(date)!.watchTime += view.watchTime;
    }

    return Array.from(map.entries()).map(([date, data]) => ({
      date,
      views: data.views,
      watchTime: data.watchTime,
    }));
  }

  groupByCountry(views: View[]) {
    const map = new Map<string, number>();

    for (const view of views) {
      const country = view.location;
      map.set(country, (map.get(country) || 0) + 1);
    }

    return Array.from(map.entries()).map(([country, views]) => ({
      country,
      views,
    }));
  }

  groupByDevice(views: View[]) {
    const total = views.length;
    const count: Record<string, number> = {};

    for (const view of views) {
      const device = view.device.toLowerCase();
      count[device] = (count[device] || 0) + 1;
    }

    const breakdown: Record<string, number> = {};
    for (const device in count) {
      breakdown[device] = Math.round((count[device] / total) * 100);
    }

    return breakdown;
  }

  generateRetentionChart(views: View[]) {
    return [
      { time: 0, percentage: 100 },
      { time: 30, percentage: 85 },
      { time: 60, percentage: 70 },
    ];
  }
}
