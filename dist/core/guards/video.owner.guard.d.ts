import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../databases/prisma.service';
export declare class VideoOwnerGuard implements CanActivate {
    private readonly db;
    constructor(db: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
