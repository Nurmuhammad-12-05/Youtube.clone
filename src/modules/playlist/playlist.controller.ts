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
import { VideoOwnerGuard } from 'src/core/guards/video.owner.guard';
import { UpdatePlaylistDto } from './dto/update.playlist';

@Controller('/playlists')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN'])
  async create(@Body() dto: CreatePlaylistDto, @Req() req: Request) {
    const userId = req['userId'];
    return this.playlistService.createPlaylist(dto, userId);
  }

  @Post(':id/videos')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN'])
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
  async getPlaylist(@Param('id') playlistId: string, @Req() req: Request) {
    const userId = req['userId'];

    return this.playlistService.getPlaylistById(playlistId, userId);
  }

  @Get('/users/:userId/playlists')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
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
