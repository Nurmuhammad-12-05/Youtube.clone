import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class SeederService implements OnModuleInit {
    private readonly db;
    private readonly configService;
    private readonly logger;
    constructor(db: PrismaService, configService: ConfigService);
    sendAll(): Promise<void>;
    sendUsers(): Promise<boolean>;
    onModuleInit(): Promise<void>;
}
