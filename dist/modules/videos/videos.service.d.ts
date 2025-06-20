import { Response } from 'express';
import VideoProcessingService from 'src/core/video.processing.service';
import { CreateVideoDto } from './dto/create.video';
import { PrismaService } from 'src/core/databases/prisma.service';
import { UpdateVideoDto } from './dto/update.video';
import { GetFeedDto } from './dto/video.feed';
import { View } from '@prisma/client';
import { CreateViewDto } from './dto/create.view';
export declare class VideosService {
    private videoProcessingService;
    private readonly db;
    constructor(videoProcessingService: VideoProcessingService, db: PrismaService);
    uploadVideo(file: Express.Multer.File, createVideoDto: CreateVideoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            status: string;
            uploadProgress: number;
            processingProgress: number;
            estimatedProcessingTime: string;
            metadata: {
                duration: string;
                hasAudio: true;
                resolution: string;
                availableQualities: string[];
                fileSize: string;
            };
        };
    }>;
    videoStream(id: string, quality: string, range: string, res: Response): Promise<{
        Status: number;
        'Content-Range': string;
        'Content-Type': string;
    }>;
    getVideoStatus(id: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.VideoStatus;
        processingProgress: number;
        availableQualities: string[];
        estimatedTimeRemaining: string;
    }>;
    getVideoDetails(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        thumbnail: string | null;
        videoUrl: string;
        availableQualities: string[];
        duration: number;
        viewsCount: bigint;
        likesCount: number;
        dislikesCount: number;
        commentsCount: number;
        publishedAt: Date;
        author: {
            id: string;
            username: string;
            channelName: string | null;
            avatar: string | null;
            subscribersCount: number;
            isVerified: boolean;
        };
        tags: string[];
        category: string | null;
    }>;
    updateVideo(updateVideo: UpdateVideoDto, id: string): Promise<{
        message: string;
    }>;
    deleteVideo(id: string): Promise<{
        message: string;
    }>;
    getFeed(opts: GetFeedDto): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        thumbnail: string | null;
        duration: number;
        category: string | null;
        viewsCount: bigint;
        likesCount: number;
        author: {
            id: string;
            username: string;
            avatar: string | null;
            channelName: string | null;
        };
    }[]>;
    recordView(videoId: string, dto: CreateViewDto, userId?: string): Promise<{
        message: string;
    }>;
    getAnalytics(videoId: string, timeframe: string, userId: string): Promise<{
        success: boolean;
        data: {
            totalViews: number;
            totalWatchTime: number;
            averageViewDuration: number;
            viewsByDay: {
                date: string;
                views: number;
                watchTime: number;
            }[];
            viewsByCountry: {
                country: string;
                views: number;
            }[];
            deviceBreakdown: Record<string, number>;
            retention: {
                time: number;
                percentage: number;
            }[];
        };
    }>;
    groupByDay(views: View[]): {
        date: string;
        views: number;
        watchTime: number;
    }[];
    groupByCountry(views: View[]): {
        country: string;
        views: number;
    }[];
    groupByDevice(views: View[]): Record<string, number>;
    generateRetentionChart(views: View[]): {
        time: number;
        percentage: number;
    }[];
}
