import { VideosService } from './videos.service';
import { Request, Response } from 'express';
import { CreateVideoDto } from './dto/create.video';
import { UpdateVideoDto } from './dto/update.video';
export declare class VideosController {
    private readonly videoService;
    constructor(videoService: VideosService);
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
    videoStream(id: string, quality: string, res: Response, req: Request): Promise<void>;
    getVideoStatus(id: string): Promise<{
        data: {
            id: string;
            status: import(".prisma/client").$Enums.VideoStatus;
            processingProgress: number;
            availableQualities: string[];
            estimatedTimeRemaining: string;
        };
    }>;
    getVideoDetails(id: string): Promise<{
        data: {
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
        };
    }>;
    updateVideo(updateVideo: UpdateVideoDto, id: string): Promise<{
        message: string;
    }>;
    deleteVideo(id: string): Promise<{
        message: string;
    }>;
}
