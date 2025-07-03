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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Channels') // Swagger'dagi bo'lim nomi
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('/:username')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchining kanal maʼlumotlarini olish' })
  @ApiParam({ name: 'username', description: 'Foydalanuvchining usernameʼi' })
  @ApiResponse({ status: 200, description: 'Kanal maʼlumotlari muvaffaqiyatli olindi' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kanalga tegishli videolarni olish' })
  @ApiParam({ name: 'username', description: 'Kanal usernameʼi' })
  @ApiQuery({ name: 'limit', required: false, example: '20' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['newest', 'oldest', 'most_viewed'],
    example: 'newest',
  })
  @ApiResponse({ status: 200, description: 'Kanal videolari muvaffaqiyatli olindi' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchining kanal maʼlumotlarini tahrirlash' })
  @ApiBody({ type: UpdateChannelDto })
  @ApiResponse({ status: 200, description: 'Kanal maʼlumotlari yangilandi' })
  async updateChannel(@Req() req: Request, @Body() body: UpdateChannelDto) {
    const userId = req['userId'];
    return this.channelsService.updateChannelInfo(userId, body);
  }
}
