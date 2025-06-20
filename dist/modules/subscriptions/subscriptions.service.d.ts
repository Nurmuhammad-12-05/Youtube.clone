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
        success: boolean;
    }>;
}
