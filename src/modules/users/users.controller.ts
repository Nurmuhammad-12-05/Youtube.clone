import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoleGuard } from 'src/core/guards/role.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UpdateProfileDto } from './dto/update.user.profil';
import fs from 'fs';
import path from 'path';
import { CreateEmailVerifycationLinkDto } from './dto/create.email.dto';

@Controller('users')
@UseGuards(RoleGuard)
@SetMetadata('role', ['USER'])
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  async getMyProfile(@Req() req: Request) {
    const userId = req['userId'];

    return await this.userService.getProfileById(userId);
  }

  @Put('me')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = path.join(process.cwd(), 'uploads', 'avatars');

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const fileName = uuidv4() + extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() dto: UpdateProfileDto,
  ) {
    if (!file) throw new BadRequestException('File not found');

    const userId = req['userId'];

    const BASE_URL = 'http://localhost:4000/api';

    const avatar = file
      ? `${BASE_URL}/uploads/avatars/${file.filename}`
      : undefined;

    return this.userService.updateProfile(userId, dto, avatar, file?.filename);
  }

  @Get('me/history')
  async getWatchHistory(
    @Req() req: Request,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ) {
    const userId = req['userId'];

    const take = parseInt(limit) || 10;

    const skip = ((parseInt(page) || 1) - 1) * take;

    return this.userService.getWatchHistory(userId, take, skip);
  }

  @Delete('me/history')
  async clearWatchHistory(@Req() req: Request) {
    const userId = req['userId'];

    return this.userService.clearWatchHistory(userId);
  }

  @Post('/create-user-email/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async createUserEmail(
    @Body() createEmailVerifycationLinkDto: CreateEmailVerifycationLinkDto,
    @Param('id') id: string,
  ) {
    return await this.userService.createUserEmail(
      createEmailVerifycationLinkDto,
      id,
    );
  }

  @Post('/email/send-verifycation-link')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @HttpCode(200)
  async sendEmailVerifycationLink(@Body('email') email: string) {
    return await this.userService.sendEmailVerifycationLink(email);
  }

  @Get('/user/verify-email')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  async verifyEmailUser(@Query('token') token: string) {
    return await this.userService.verifyEmailUser(token);
  }
}
