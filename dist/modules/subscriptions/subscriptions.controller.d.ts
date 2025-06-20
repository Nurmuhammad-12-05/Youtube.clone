import { SubscriptionsService } from './subscriptions.service';
import { Request } from 'express';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    subscribe(channelId: string, req: Request): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            subscriptionId: string;
            channeId: string;
            notificationsEnabled: boolean;
        };
    }>;
    unsubscribe(channelId: string, req: Request): Promise<{
        message: string;
    }>;
    getSubscriptions(page?: number, limit?: number): Promise<{
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
    getSubscriptionFeed(page: number | undefined, limit: number | undefined, req: Request): Promise<{
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
