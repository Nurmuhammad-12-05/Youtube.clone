import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/core/guards/role.guard';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(RoleGuard)
@SetMetadata('role', ['ADMIN'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('videos/pending')
  @ApiOperation({ summary: 'Get pending videos list' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  getPendingVideos(@Query('limit') limit = 20, @Query('page') page = 1) {
    return this.adminService.getPendingVideos(Number(limit), Number(page));
  }

  @Patch('videos/:id/approve')
  @ApiOperation({ summary: 'Approve a pending video' })
  @ApiParam({ name: 'id', type: String })
  approveVideo(@Param('id') id: string) {
    return this.adminService.approveVideo(id);
  }

  @Patch('videos/:id/reject')
  @ApiOperation({ summary: 'Reject a pending video' })
  @ApiParam({ name: 'id', type: String })
  rejectVideo(@Param('id') id: string) {
    return this.adminService.rejectVideo(id);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get users with optional filters' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  getUsers(
    @Query('limit') limit = 50,
    @Query('page') page = 1,
    @Query('search') search = '',
    @Query('status') status = '',
  ) {
    return this.adminService.getUsers(+limit, +page, search, status);
  }

  @Patch('users/:id/block')
  @ApiOperation({ summary: 'Block a user by ID' })
  @ApiParam({ name: 'id', type: String })
  blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @Patch('users/:id/verify')
  @ApiOperation({ summary: 'Verify a user by ID' })
  @ApiParam({ name: 'id', type: String })
  verifyUser(@Param('id') id: string) {
    return this.adminService.verifyUser(id);
  }
}
