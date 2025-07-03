import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create.playlist';
import { Request } from 'express';
import { RoleGuard } from 'src/core/guards/role.guard';
import { AddVideoToPlaylistDto } from './dto/add.video.to.playlist';
import { UpdatePlaylistDto } from './dto/update.playlist';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Playlists')
@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yangi playlist yaratish' })
  @ApiBody({ type: CreatePlaylistDto })
  @ApiResponse({ status: 201, description: 'Playlist muvaffaqiyatli yaratildi' })
  async create(@Body() dto: CreatePlaylistDto, @Req() req: Request) {
    const userId = req['userId'];
    return this.playlistService.createPlaylist(dto, userId);
  }

  @Post(':id/videos')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Playlistga video qo‘shish' })
  @ApiParam({ name: 'id', description: 'Playlist IDsi' })
  @ApiBody({ type: AddVideoToPlaylistDto })
  @ApiResponse({ status: 201, description: 'Video playlistga muvaffaqiyatli qo‘shildi' })
  async addVideoToPlaylist(
    @Param('id') playlistId: string,
    @Body() dto: AddVideoToPlaylistDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return this.playlistService.addVideoToPlaylist(playlistId, dto, userId);
  }

  @Get(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bitta playlistni olish' })
  @ApiParam({ name: 'id', description: 'Playlist IDsi' })
  @ApiResponse({ status: 200, description: 'Playlist maʼlumotlari qaytarildi' })
  async getPlaylist(@Param('id') playlistId: string, @Req() req: Request) {
    const userId = req['userId'];
    return this.playlistService.getPlaylistById(playlistId, userId);
  }

  @Get('/users/:userId/playlists')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Foydalanuvchining barcha playlistlarini olish' })
  @ApiParam({ name: 'userId', description: 'Foydalanuvchi IDsi' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchining playlistlari qaytarildi' })
  async getUserPlaylists(
    @Param('userId') userId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Req() req: Request,
  ) {
    const viewerId = req['userId'];
    return this.playlistService.getUserPlaylists(
      userId,
      viewerId,
      parseInt(limit) || 10,
      parseInt(page) || 1,
    );
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Playlistni tahrirlash' })
  @ApiParam({ name: 'id', description: 'Playlist IDsi' })
  @ApiBody({ type: UpdatePlaylistDto })
  @ApiResponse({ status: 200, description: 'Playlist muvaffaqiyatli yangilandi' })
  async updatePlaylist(
    @Param('id') playlistId: string,
    @Body() dto: UpdatePlaylistDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return this.playlistService.updatePlaylist(playlistId, userId, dto);
  }

  @Delete(':id/videos/:videoId')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Playlistdan videoni olib tashlash' })
  @ApiParam({ name: 'id', description: 'Playlist IDsi' })
  @ApiParam({ name: 'videoId', description: 'Olib tashlanayotgan video IDsi' })
  @ApiResponse({ status: 200, description: 'Video muvaffaqiyatli o‘chirildi' })
  async removeVideoFromPlaylist(
    @Param('id') playlistId: string,
    @Param('videoId') videoId: string,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return this.playlistService.removeVideoFromPlaylist(
      playlistId,
      videoId,
      userId,
    );
  }
}
