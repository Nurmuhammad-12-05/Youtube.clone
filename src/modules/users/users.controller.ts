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
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(RoleGuard)
@SetMetadata('role', ['USER'])
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'O‘z profilingizni olish' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi profili qaytarildi' })
  async getMyProfile(@Req() req: Request) {
    const userId = req['userId'];
    return await this.userService.getProfileById(userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Profilni yangilash (avatar bilan)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profil maʼlumotlari va avatar fayli',
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Ali' },
        lastName: { type: 'string', example: 'Valiyev' },
        channelName: { type: 'string', example: 'Ali Channel' },
        channelDescription: { type: 'string', example: 'Texnologiya va vloglar' },
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profil muvaffaqiyatli yangilandi' })
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
    const avatar = `${BASE_URL}/uploads/avatars/${file.filename}`;
    return this.userService.updateProfile(userId, dto, avatar, file?.filename);
  }

  @Get('me/history')
  @ApiOperation({ summary: 'Tomosha tarixi olish' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Tomosha tarixi ro‘yxati' })
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
  @ApiOperation({ summary: 'Tomosha tarixini tozalash' })
  @ApiResponse({ status: 200, description: 'Tomosha tarixi tozalandi' })
  async clearWatchHistory(@Req() req: Request) {
    const userId = req['userId'];
    return this.userService.clearWatchHistory(userId);
  }

  @Post('/create-user-email/:id')
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiOperation({ summary: 'Foydalanuvchiga email biriktirish' })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi IDsi' })
  @ApiBody({ type: CreateEmailVerifycationLinkDto })
  @ApiResponse({ status: 201, description: 'Email biriktirildi va yuborildi' })
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
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @HttpCode(200)
  @ApiOperation({ summary: 'Email tasdiqlash linkini yuborish' })
  @ApiBody({ type: CreateEmailVerifycationLinkDto })
  @ApiResponse({ status: 200, description: 'Emailga tasdiqlash linki yuborildi' })
  async sendEmailVerifycationLink(
    @Body() dto: CreateEmailVerifycationLinkDto,
  ) {
    return await this.userService.sendEmailVerifycationLink(dto.email);
  }

  @Get('/user/verify-email')
  @SetMetadata('role', ['USER', 'ADMIN', 'SUPERADMIN'])
  @ApiOperation({ summary: 'Email tasdiqlash tokenini tekshirish' })
  @ApiQuery({
    name: 'token',
    required: true,
    example: 'abc123verifytoken',
    description: 'Email tasdiqlash tokeni',
  })
  @ApiResponse({ status: 200, description: 'Email tasdiqlandi' })
  async verifyEmailUser(@Query('token') token: string) {
    return await this.userService.verifyEmailUser(token);
  }
}
