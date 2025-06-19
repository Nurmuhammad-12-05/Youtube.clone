import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideosService } from './videos.service';
import path from 'path';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { CreateVideoDto } from './dto/create.video';

@Controller('/videos')
@SetMetadata('isPublic', true)
export class VideosController {
  constructor(private readonly videoService: VideosService) {}

  @Post('/upload')
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
  async getVideoStatus(@Param('id') id: string) {
    const param = id;

    const data = await this.videoService.getVideoStatus(id);

    return { data };
  }

  @Get('/:id')
  async getVideoDetails(@Param('id') id: string) {
    const param = id;

    const data = await this.videoService.getVideoDetails(id);

    return { data };
  }
}
