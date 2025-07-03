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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Videos')
@ApiBearerAuth()
@Controller('/videos')
export class VideosController {
  constructor(private readonly videoService: VideosService) {}

  @Post('/upload')
  @ApiOperation({ summary: 'Yangi video yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        title: {
          type: 'string',
        },
        description: {
          type: 'string',
        },
        authorId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video muvaffaqiyatli yuklandi' })
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
  @ApiOperation({ summary: 'Videoni stream qilish' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @ApiQuery({ name: 'quality', required: false, example: '720p' })
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async videoStream(
    @Param('id') id: string,
    @Query('quality') quality: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const contentRange = req.headers.range;
    await this.videoService.videoStream(id, quality, contentRange as string, res);
  }

  @Get('/:id/status')
  @ApiOperation({ summary: 'Videoning holatini olish' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getVideoStatus(@Param('id') id: string) {
    return { data: await this.videoService.getVideoStatus(id) };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Videoning to‘liq maʼlumotini olish' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getVideoDetails(@Param('id') id: string) {
    return { data: await this.videoService.getVideoDetails(id) };
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Videoni tahrirlash' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @ApiBody({ type: UpdateVideoDto })
  @UseGuards(RoleGuard, VideoOwnerGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async updateVideo(@Body() updateVideo: UpdateVideoDto, @Param('id') id: string) {
    return await this.videoService.updateVideo(updateVideo, id);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Videoni o‘chirish' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @UseGuards(RoleGuard, VideoOwnerGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async deleteVideo(@Param('id') id: string) {
    return await this.videoService.deleteVideo(id);
  }

  @Get('/video/feed')
  @ApiOperation({ summary: 'Video feed olish (filterlar bilan)' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'category', required: false, example: 'music' })
  @ApiQuery({ name: 'duration', required: false, enum: ['short', 'medium', 'long'] })
  @ApiQuery({ name: 'sort', required: false, enum: ['popular', 'newest', 'oldest', 'most_viewed'] })
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async getFeed(@Query() query: GetFeedDto) {
    return this.videoService.getFeed(query);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Video ko‘rishni qayd qilish' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @ApiBody({ type: CreateViewDto })
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
  @ApiOperation({ summary: 'Video statistikasi (analytics)' })
  @ApiParam({ name: 'id', description: 'Video IDsi' })
  @ApiQuery({ name: 'timeframe', required: false, example: '7d' })
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
