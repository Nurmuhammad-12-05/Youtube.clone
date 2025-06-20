import { ChannelsService } from './channels.service';
import { Request } from 'express';
import { UpdateChannelDto } from './dto/update.channel';
export declare class ChannelsController {
    private readonly channelsService;
    constructor(channelsService: ChannelsService);
    getChannelInfo(username: string, req: Request): Promise<{
        success: boolean;
        data: {
            id: string;
            username: string;
            channelName: string | null;
            channelDescription: string | null;
            avatar: string | null;
            channelBanner: null;
            subscribersCount: number;
            totalViews: string;
            videosCount: number;
            joinedAt: Date;
            isVerified: boolean;
            isSubscribed: boolean;
        };
    }>;
    getChannelVideos(username: string, limit?: string, page?: string, sort?: 'newest' | 'oldest' | 'most_viewed'): Promise<{
        videos: {
            viewsCount: string;
            id: string;
            createdAt: Date;
            title: string;
            thumbnail: string | null;
            duration: number;
            likesCount: number;
        }[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalCount: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    updateChannel(req: Request, body: UpdateChannelDto): Promise<{
        success: boolean;
        data: {
            id: string;
            avatar: string | null;
            channelName: string | null;
            channelBanner: string | null;
            channelDescription: string | null;
        };
    }>;
}
