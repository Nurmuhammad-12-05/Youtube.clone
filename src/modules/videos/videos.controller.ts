import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideosService } from './videos.service';
import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { CreateVideoDto } from './dto/create.video';
import { UpdateVideoDto } from './dto/update.video';
import { RoleGuard } from 'src/core/guards/role.guard';
import { VideoOwnerGuard } from 'src/core/guards/video.owner.guard';
import { GetFeedDto } from './dto/video.feed';
import { CreateViewDto } from './dto/create.view';

@Controller('/videos')
export class VideosController {
  constructor(private readonly videoService: VideosService) {}

  @Post('/upload')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const mimeType = path.extname(file.originalname);

          const fileName = `${uuid()}${mimeType}`;

          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ) {
    if (!file) throw new BadRequestException('File not found');

    const data = await this.videoService.uploadVideo(file, createVideoDto);

    return data;
  }

  @Get('/:id/stream')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async videoStream(
    @Param('id') id: string,
    @Query('quality') quality: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const param = id;

    const contentRange = req.headers.Range;

    await this.videoService.videoStream(
      param,
      quality,
      contentRange as string,
      res,
    );
  }

  @Get('/:id/status')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getVideoStatus(@Param('id') id: string) {
    const param = id;

    const data = await this.videoService.getVideoStatus(id);

    return { data };
  }

  @Get('/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getVideoDetails(@Param('id') id: string) {
    const param = id;

    const data = await this.videoService.getVideoDetails(id);

    return { data };
  }

  @Put('/:id')
  @UseGuards(RoleGuard, VideoOwnerGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async updateVideo(
    @Body() updateVideo: UpdateVideoDto,
    @Param('id') id: string,
  ) {
    return await this.videoService.updateVideo(updateVideo, id);
  }

  @Delete('/:id')
  @UseGuards(RoleGuard, VideoOwnerGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async deleteVideo(@Param('id') id: string) {
    return await this.videoService.deleteVideo(id);
  }

  @Get('/video/feed')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getFeed(@Query() query: GetFeedDto) {
    return this.videoService.getFeed(query);
  }

  @Post(':id/view')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  async recordView(
    @Param('id') videoId: string,
    @Body() dto: CreateViewDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    return this.videoService.recordView(videoId, dto, userId);
  }

  @Get(':id/analytics')
  @UseGuards(VideoOwnerGuard)
  async getVideoAnalytics(
    @Param('id') videoId: string,
    @Query('timeframe') timeframe = '7d',
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    return this.videoService.getAnalytics(videoId, timeframe, userId);
  }
}
