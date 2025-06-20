import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Request } from 'express';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('/channels/:userId/subscribe')
  async subscribe(@Param('userId') channelId: string, @Req() req: Request) {
    const userId = req['userId'];

    return await this.subscriptionsService.subscribe(userId, channelId);
  }

  @Delete('/channels/:userId/subscribe')
  async unsubscribe(@Param('userId') channelId: string, @Req() req: Request) {
    const userId = req['userId'];

    return await this.subscriptionsService.unsubscribe(userId, channelId);
  }

  @Get('/subscriptions')
  async getSubscriptions(@Query('page') page = 1, @Query('limit') limit = 20) {
    const pageNumber = parseInt(page as any) || 1;

    const limitNumber = parseInt(limit as any) || 20;

    return this.subscriptionsService.getSubscriptions(pageNumber, limitNumber);
  }

  @Get('/feed')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  async getSubscriptionFeed(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    const pageNumber = parseInt(page as any) || 1;

    const limitNumber = parseInt(limit as any) || 20;

    return this.subscriptionsService.getSubscriptionFeed(
      userId,
      pageNumber,
      limitNumber,
    );
  }
}
