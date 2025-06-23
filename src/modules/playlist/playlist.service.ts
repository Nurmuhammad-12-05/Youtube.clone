import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { CreatePlaylistDto } from './dto/create.playlist';
import { AddVideoToPlaylistDto } from './dto/add.video.to.playlist';
import { Visibility } from '@prisma/client';
import { UpdatePlaylistDto } from './dto/update.playlist';

@Injectable()
export class PlaylistService {
  constructor(private readonly db: PrismaService) {}

  async createPlaylist(dto: CreatePlaylistDto, userId: string) {
    const data = await this.db.prisma.playlist.create({
      data: {
        ...dto,
        author: {
          connect: { id: userId },
        },
      },
    });

    return data;
  }

  async addVideoToPlaylist(
    playlistId: string,
    dto: AddVideoToPlaylistDto,
    userId: string,
  ) {
    const playlist = await this.db.prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { authorId: true },
    });

    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }

    if (playlist.authorId !== userId) {
      throw new ForbiddenException(
        'You can only add videos to your own playlist',
      );
    }

    const video = await this.db.prisma.video.findUnique({
      where: { id: dto.videoId },
    });

    if (!video) throw new NotFoundException('Video not found');

    const now = new Date();

    const data = await this.db.prisma.playlistVideo.create({
      data: {
        playlist: {
          connect: { id: playlistId },
        },
        video: {
          connect: { id: dto.videoId },
        },
        position: dto.position,
        addedAt: now,
      },
    });

    return { data };
  }

  async getPlaylistById(playlistId: string, userId: string) {
    const playlist = await this.db.prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        author: {
          select: { id: true, username: true },
        },
        videos: {
          orderBy: { position: 'asc' },
          include: {
            video: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                videoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');

    if (playlist.visibility === 'PRIVATE' && playlist.author.id !== userId) {
      throw new ForbiddenException('This playlist is private');
    }

    const formattedVideos = playlist.videos.map((pv: any) => ({
      ...pv.video,
      position: pv.position,
    }));

    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description,
      visibility: playlist.visibility,
      createdAt: playlist.createdAt,
      author: playlist.author,
      videos: formattedVideos,
    };
  }

  async getUserPlaylists(
    userId: string,
    viewerId: string,
    limit = 10,
    page = 1,
  ) {
    const skip = (page - 1) * limit;

    const findUser = await this.db.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!findUser) throw new BadRequestException('User not found');

    const isOwner = viewerId === userId;

    if (!isOwner)
      throw new BadRequestException(
        'This playlist does not belong to this user.',
      );

    const whereClause = {
      authorId: userId,
      ...(isOwner ? {} : { visibility: { not: Visibility.PRIVATE } }),
    };

    const [total, items] = await this.db.prisma.$transaction([
      this.db.prisma.playlist.count({ where: whereClause }),
      this.db.prisma.playlist.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, username: true } },
          _count: { select: { videos: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      items,
    };
  }

  async updatePlaylist(
    playlistId: string,
    userId: string,
    dto: UpdatePlaylistDto,
  ) {
    const playlist = await this.db.prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) throw new NotFoundException('Playlist topilmadi');

    const isOwner = playlist.authorId === userId;

    if (!isOwner) {
      throw new ForbiddenException(
        'Siz bu playlistni tahrirlash huquqiga ega emassiz',
      );
    }

    const updated = await this.db.prisma.playlist.update({
      where: { id: playlistId },
      data: dto,
    });

    return { updated };
  }

  async removeVideoFromPlaylist(
    playlistId: string,
    videoId: string,
    userId: string,
  ) {
    const playlist = await this.db.prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { authorId: true },
    });

    if (!playlist) throw new NotFoundException('Playlist topilmadi');

    if (playlist.authorId !== userId)
      throw new ForbiddenException(
        `Sizga bu playlistni o'chirishga  ruxsat yo‘q`,
      );

    await this.db.prisma.playlistVideo.deleteMany({
      where: {
        playlistId,
        videoId,
      },
    });

    return { message: 'Video playlistdan o‘chirildi' };
  }
}
