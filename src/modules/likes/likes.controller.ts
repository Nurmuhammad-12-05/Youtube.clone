import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CommentLikeDto } from './dto/comment.leki';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Likes') // Swagger UI'dagi bo‘lim nomi
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  // Domla bu API ham like uchun, ham dislike uchun!
  @Post('/comments/:id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kommentga LIKE yoki DISLIKE berish' })
  @ApiParam({ name: 'id', description: 'Komment IDsi' })
  @ApiBody({ type: CommentLikeDto })
  @ApiResponse({ status: 201, description: 'Kommentga baho berildi (LIKE yoki DISLIKE)' })
  async likeComment(
    @Param('id') commentId: string,
    @Body() dto: CommentLikeDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return this.likesService.likeComment(commentId, dto.type, userId);
  }

  @Delete('/comments/:id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kommentga berilgan LIKE yoki DISLIKE ni olib tashlash' })
  @ApiParam({ name: 'id', description: 'Komment IDsi' })
  @ApiResponse({ status: 200, description: 'LIKE yoki DISLIKE muvaffaqiyatli o‘chirildi' })
  async removeCommentLike(@Param('id') commentId: string, @Req() req: Request) {
    const userId = req['userId'];
    return this.likesService.removeCommentLike(commentId, userId);
  }
}
