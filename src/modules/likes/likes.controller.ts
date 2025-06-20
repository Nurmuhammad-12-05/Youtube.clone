import { Body, Controller, Delete, Param, Post, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CommentLikeDto } from './dto/comment.leki';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  //Domla bu api ham like uchun ham disllike qilish uchun!
  //Tz da adeni qilingan ekan bita qilib qoyordim.
  @Post('/comments/:id/like')
  async likeComment(
    @Param('id') commentId: string,
    @Body() dto: CommentLikeDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return this.likesService.likeComment(commentId, dto.type, userId);
  }

  @Delete('/comments/:id/like')
  async removeCommentLike(@Param('id') commentId: string, @Req() req: Request) {
    const userId = req['userId'];
    return this.likesService.removeCommentLike(commentId, userId);
  }
}
