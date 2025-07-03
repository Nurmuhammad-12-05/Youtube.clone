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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('/channels/:userId/subscribe')
  @ApiOperation({ summary: 'Foydalanuvchi kanaliga obuna bo‘lish' })
  @ApiParam({ name: 'userId', description: 'Kanal egasining foydalanuvchi IDsi' })
  @ApiResponse({ status: 201, description: 'Obuna muvaffaqiyatli amalga oshirildi' })
  @ApiBearerAuth()
  async subscribe(@Param('userId') channelId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.subscriptionsService.subscribe(userId, channelId);
  }

  @Delete('/channels/:userId/subscribe')
  @ApiOperation({ summary: 'Kanal obunasidan chiqish' })
  @ApiParam({ name: 'userId', description: 'Kanal egasining foydalanuvchi IDsi' })
  @ApiResponse({ status: 200, description: 'Obunachilik bekor qilindi' })
  @ApiBearerAuth()
  async unsubscribe(@Param('userId') channelId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.subscriptionsService.unsubscribe(userId, channelId);
  }

  @Get('/subscriptions')
  @ApiOperation({ summary: 'Hamma foydalanuvchilar obunalari ro‘yxati (admin uchun)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Obunalar ro‘yxati qaytarildi' })
  async getSubscriptions(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const pageNumber = parseInt(page as any) || 1;
    const limitNumber = parseInt(limit as any) || 20;

    return this.subscriptionsService.getSubscriptions(pageNumber, limitNumber);
  }

  @Get('/feed')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obuna qilingan kanallar videolari' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, description: 'Obuna qilingan kanallardan feed qaytarildi' })
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
