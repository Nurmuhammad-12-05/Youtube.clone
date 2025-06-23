import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/databases/prisma.service';
import { UpdateProfileDto } from './dto/update.user.profil';
import fs from 'fs';
import path from 'path';
import { EmailOtpService } from '../auth/email.otp.service';
import { CreateEmailVerifycationLinkDto } from './dto/create.email.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailOtpService: EmailOtpService,
    private readonly db: PrismaService,
  ) {}

  async getProfileById(userId: string) {
    const user = await this.db.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        phone_number: true,
        avatar: true,
        firstName: true,
        lastName: true,
        channelName: true,
        channelDescription: true,
        role: true,
        is_email_verified: true,
        is_phone_verified: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    newAvatarUrl?: string,
    newAvatarFileName?: string,
  ) {
    const oldUser = await this.db.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (oldUser?.avatar && newAvatarFileName) {
      const oldFilePath = path.join(
        process.cwd(),
        'uploads',
        'avatars',
        path.basename(oldUser.avatar),
      );

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const data: any = { ...dto };
    if (newAvatarUrl) data.avatar = newAvatarUrl;

    const updatedUser = await this.db.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        channelName: true,
        channelDescription: true,
      },
    });

    if (!updatedUser) throw new BadRequestException('User not found');

    return updatedUser;
  }

  async getWatchHistory(userId: string, take: number, skip: number) {
    const [history, total] = await Promise.all([
      this.db.prisma.watchHistory.findMany({
        where: { userId },
        take,
        skip,
        orderBy: { watchedAt: 'desc' },
        include: {
          video: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              duration: true,
              videoUrl: true,
            },
          },
        },
      }),
      this.db.prisma.watchHistory.count({
        where: { userId },
      }),
    ]);

    return {
      total,
      page: Math.floor(skip / take) + 1,
      perPage: take,
      data: history,
    };
  }

  async clearWatchHistory(userId: string) {
    const existing = await this.db.prisma.watchHistory.findFirst({
      where: { userId },
    });

    if (!existing) {
      return {
        message: 'Watch history is already empty',
        deletedCount: 0,
      };
    }

    const deleted = await this.db.prisma.watchHistory.deleteMany({
      where: { userId },
    });

    return {
      message: 'Watch history cleared',
      deletedCount: deleted.count,
    };
  }

  async createUserEmail(
    createEmailVerifycationLinkDto: CreateEmailVerifycationLinkDto,
    id: string,
  ) {
    const findUser = await this.db.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!findUser) throw new NotFoundException('User not found');

    const udateUser = await this.db.prisma.user.update({
      where: { id: id },
      data: {
        ...createEmailVerifycationLinkDto,
      },
      select: {
        id: true,
        phone_number: true,
        email: true,
        is_phone_verified: true,
        is_email_verified: true,
      },
    });

    return udateUser;
  }

  async sendEmailVerifycationLink(email: string) {
    const findUser = await this.db.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!findUser) throw new BadRequestException('Email not found');

    const token = await this.emailOtpService.sendEmailLink(email);

    return {
      message: 'sended',
      token,
    };
  }

  async verifyEmailUser(token: string) {
    const data = await this.emailOtpService.getEmailToken(token);

    const response = JSON.parse(data as string);

    const user = await this.db.prisma.user.findFirst({
      where: { email: response.email },
    });

    await this.db.prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        is_email_verified: true,
      },
    });

    return `<h1>Email mofaqyatli tasdiqlandi</h1>`;
  }
}
