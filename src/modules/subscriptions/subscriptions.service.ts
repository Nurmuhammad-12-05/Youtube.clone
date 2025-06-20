import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/databases/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly db: PrismaService) {}

  async subscribe(userId: string, channelId: string) {
    if (userId === channelId) {
      throw new BadRequestException('You cannot subscribe to yourself');
    }

    try {
      const subscription = await this.db.prisma.subscription.create({
        data: {
          subscriptionId: userId,
          channeId: channelId,
        },
      });

      return { success: true, data: subscription };
    } catch (e) {
      throw new ConflictException('Already subscribed');
    }
    throw new InternalServerErrorException('Internal server error');
  }

  async unsubscribe(userId: string, channelId: string) {
    const findSubscription = await this.db.prisma.subscription.deleteMany({
      where: { subscriptionId: userId, channeId: channelId },
    });

    if (!findSubscription)
      throw new NotFoundException('Subscription not found');

    return { success: true };
  }
}
