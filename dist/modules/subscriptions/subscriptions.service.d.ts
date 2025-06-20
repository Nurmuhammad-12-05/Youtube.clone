import { PrismaService } from 'src/core/databases/prisma.service';
export declare class SubscriptionsService {
    private readonly db;
    constructor(db: PrismaService);
    subscribe(userId: string, channelId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            subscriptionId: string;
            channeId: string;
            notificationsEnabled: boolean;
        };
    }>;
    unsubscribe(userId: string, channelId: string): Promise<{
        message: string;
    }>;
    getSubscriptions(page: number, limit: number): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            subscriber: {
                id: string;
                username: string;
                avatar: string | null;
            };
            channel: {
                id: string;
                username: string;
                avatar: string | null;
                channelName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            subscriptionId: string;
            channeId: string;
            notificationsEnabled: boolean;
        })[];
    }>;
    getSubscriptionFeed(userId: string, page: number, limit: number): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            author: {
                id: string;
                username: string;
                avatar: string | null;
                channelName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            thumbnail: string | null;
            videoUrl: string;
            duration: number;
            fileSize: bigint;
            hasAudio: boolean;
            resolution: string;
            tags: string[];
            category: string | null;
            availableQualities: string[];
            status: import(".prisma/client").$Enums.VideoStatus;
            visibility: import(".prisma/client").$Enums.Visibility;
            viewsCount: bigint;
            likesCount: number;
            dislikesCount: number;
            authorId: string;
        })[];
    }>;
}
