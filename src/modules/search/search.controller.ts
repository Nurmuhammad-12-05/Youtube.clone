import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchSuggestionDto } from './dto/search.query';
import { RecommendationQueryDto } from './dto/recommendation.query';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggestions')
  @ApiOperation({ summary: 'Qidiruv bo‘yicha so‘zlar uchun takliflar' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Qidiruv uchun query so‘zi',
    example: 'nestjs',
  })
  @ApiResponse({ status: 200, description: 'Qidiruv takliflari ro‘yxati' })
  async getSuggestions(@Query() query: SearchSuggestionDto) {
    return this.searchService.getSuggestions(query);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Video uchun tavsiyalar ro‘yxati' })
  @ApiQuery({
    name: 'videoId',
    required: true,
    description: 'Video ID (UUID)',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nechta tavsiya olish (default: 10)',
    example: '10',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagination sahifasi (default: 1)',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Video tavsiyalari ro‘yxati' })
  async getRecommendations(@Query() query: RecommendationQueryDto) {
    return this.searchService.getRecommendations(query);
  }
}
