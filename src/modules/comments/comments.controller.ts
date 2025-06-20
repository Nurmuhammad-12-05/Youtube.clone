import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Request } from 'express';
import { CreateCommentDto } from './dto/creatw.comment';
import { QueryCommentsDto } from './dto/query.comment';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/videos/:videoId/comments')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  async addComment(
    @Param('videoId') videoId: string,
    @Body() dto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    return this.commentsService.addComment(videoId, userId, dto);
  }

  @Get('/videos/:videoId/comments')
  async getComments(
    @Param('videoId') videoId: string,
    @Query() query: QueryCommentsDto,
  ) {
    return this.commentsService.getComments(videoId, query);
  }

  @Put(':id/pin')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER'])
  async togglePinComment(@Param('id') commentId: string, @Req() req: Request) {
    const userId = req['userId'];
    return this.commentsService.togglePinComment(commentId, userId);
  }
}
