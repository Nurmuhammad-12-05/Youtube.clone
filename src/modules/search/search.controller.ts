import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchSuggestionDto } from './dto/search.query';
import { RecommendationQueryDto } from './dto/recommendation.query';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('suggestions')
  async getSuggestions(@Query() query: SearchSuggestionDto) {
    return this.searchService.getSuggestions(query);
  }

  @Get('recommendations')
  async getRecommendations(@Query() query: RecommendationQueryDto) {
    return this.searchService.getRecommendations(query);
  }
}
