import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger: Logger;
  constructor(
    private readonly db: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(SeederService.name);
  }

  async sendAll() {
    await this.sendUsers();
  }

  async sendUsers() {
    this.logger.log('User seedr started');

    const username = this.configService.get('SUPERADMIN_USERNAME') as string;

    const password = this.configService.get('SUPERADMIN_PASSWORD') as string;

    const phone_number = this.configService.get(
      'SUPERADMIN_PHONE_NUMBER',
    ) as string;

    const role = 'SUPERADMIN';

    const findUsername = await this.db.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const hashPassword = await bcrypt.hash(password, 12);

    if (!findUsername) {
      await this.db.prisma.user.create({
        data: {
          username: username,
          password: hashPassword,
          phone_number: phone_number,
          firstName: 'Nodirbek',
          lastName: 'Ashuraliyev',
          role: role,
        },
      });

      this.logger.log('User seedrs ended');
    }

    return true;
  }

  async onModuleInit() {
    try {
      await this.sendAll();
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
