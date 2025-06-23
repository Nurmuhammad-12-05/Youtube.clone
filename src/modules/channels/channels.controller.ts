import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { Request } from 'express';
import { RoleGuard } from 'src/core/guards/role.guard';
import { UpdateChannelDto } from './dto/update.channel';
import { VideoOwnerGuard } from 'src/core/guards/video.owner.guard';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('/:username')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getChannelInfo(
    @Param('username') username: string,
    @Req() req: Request,
  ) {
    const currentUserId = req['userId'];
    return this.channelsService.getChannelInfo(username, currentUserId);
  }

  @Get('/:username/videos')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getChannelVideos(
    @Param('username') username: string,
    @Query('limit') limit = '20',
    @Query('page') page = '1',
    @Query('sort') sort: 'newest' | 'oldest' | 'most_viewed' = 'newest',
  ) {
    return this.channelsService.getChannelVideos({
      username,
      limit: parseInt(limit),
      page: parseInt(page),
      sort,
    });
  }

  @Put('/me')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  async updateChannel(@Req() req: Request, @Body() body: UpdateChannelDto) {
    const userId = req['userId'];
    return this.channelsService.updateChannelInfo(userId, body);
  }
}
