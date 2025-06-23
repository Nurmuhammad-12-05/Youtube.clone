import { IsEnum } from 'class-validator';

export enum LikeType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export class CommentLikeDto {
  @IsEnum(LikeType)
  type: LikeType;
}
