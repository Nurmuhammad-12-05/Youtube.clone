import { Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('channels')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post(':userId/subscribe')
  async subscribe(@Param('userId') channelId: string, @Req() req: any) {
    const userId = req['userid'];

    return await this.subscriptionsService.subscribe(userId, channelId);
  }

  @Delete(':userId/subscribe')
  async unsubscribe(@Param('userId') channelId: string, @Req() req: any) {
    const userId = req['userid'];

    return await this.subscriptionsService.unsubscribe(userId, channelId);
  }
}
