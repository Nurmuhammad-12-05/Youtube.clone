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

@Controller('admin')
@UseGuards(RoleGuard)
@SetMetadata('role', ['ADMIN'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('videos/pending')
  getPendingVideos(@Query('limit') limit = 20, @Query('page') page = 1) {
    return this.adminService.getPendingVideos(Number(limit), Number(page));
  }

  @Patch('videos/:id/approve')
  approveVideo(@Param('id') id: string) {
    return this.adminService.approveVideo(id);
  }

  @Patch('videos/:id/reject')
  rejectVideo(@Param('id') id: string) {
    return this.adminService.rejectVideo(id);
  }

  @Get('users')
  getUsers(
    @Query('limit') limit = 50,
    @Query('page') page = 1,
    @Query('search') search = '',
    @Query('status') status = '',
  ) {
    return this.adminService.getUsers(+limit, +page, search, status);
  }

  @Patch('users/:id/block')
  blockUser(@Param('id') id: string) {
    return this.adminService.blockUser(id);
  }

  @Patch('users/:id/verify')
  verifyUser(@Param('id') id: string) {
    return this.adminService.verifyUser(id);
  }
}
