import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    readonly prisma: PrismaClient;
    private readonly logger;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
