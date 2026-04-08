import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // This connects to the database when the app starts
    await this.$connect();
  }

  async onModuleDestroy() {
    // This closes the connection when the app stops
    await this.$disconnect();
  }
}
