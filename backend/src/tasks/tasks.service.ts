import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any) {
    if (user.role === 'ADMIN') {
      return this.prisma.task.findMany({ include: { assignedTo: true } });
    }
    return this.prisma.task.findMany({ where: { assignedUserId: user.sub } });
  }
}
