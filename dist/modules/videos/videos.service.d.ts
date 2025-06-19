import { Response } from 'express';
import VideoProcessingService from 'src/core/video.processing.service';
import { CreateVideoDto } from './dto/create.video';
import { PrismaService } from 'src/core/databases/prisma.service';
import { UpdateVideoDto } from './dto/update.video';
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
}
