import { IsEnum, IsOptional, IsNumberString } from 'class-validator';

export enum CommentSort {
  TOP = 'top',
  NEW = 'new',
  OLD = 'old',
}

export class QueryCommentsDto {
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsEnum(CommentSort)
  sort?: CommentSort;
}
