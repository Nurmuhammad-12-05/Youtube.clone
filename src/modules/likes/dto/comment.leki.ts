import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LikeType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

export class CommentLikeDto {
  @ApiProperty({
    enum: LikeType,
    example: LikeType.LIKE,
    description: 'Kommentga berilgan baho turi: LIKE yoki DISLIKE',
  })
  @IsEnum(LikeType)
  type: LikeType;
}
