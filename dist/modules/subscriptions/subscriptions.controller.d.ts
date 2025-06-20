import { SubscriptionsService } from './subscriptions.service';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    subscribe(channelId: string, req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            subscriptionId: string;
            channeId: string;
            notificationsEnabled: boolean;
        };
    }>;
    unsubscribe(channelId: string, req: any): Promise<{
        success: boolean;
    }>;
}
