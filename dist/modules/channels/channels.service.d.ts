import { PrismaService } from 'src/core/databases/prisma.service';
import { UpdateChannelDto } from './dto/update.channel';
export declare class ChannelsService {
    private readonly db;
    constructor(db: PrismaService);
    getChannelInfo(username: string, currentUserId?: string): Promise<{
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
    getChannelVideos(params: {
        username: string;
        limit: number;
        page: number;
        sort: 'newest' | 'oldest' | 'most_viewed';
    }): Promise<{
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
    updateChannelInfo(userId: string, data: UpdateChannelDto): Promise<{
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
