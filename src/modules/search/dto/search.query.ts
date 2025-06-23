import { IsOptional, IsString } from 'class-validator';

export class SearchSuggestionDto {
  @IsString()
  @IsOptional()
  q?: string;
}
