import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Root') // Swagger da kategoriya nomi
@Controller()
@SetMetadata('isPublic', true)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Server holatini tekshirish' }) // qisqacha izoh
  @ApiResponse({ status: 200, description: 'Server ishlayapti. Salom xabari yuboriladi' })
  getHello() {
    return this.appService.getHelo();
  }
}
