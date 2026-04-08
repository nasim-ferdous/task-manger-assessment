import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    if (req.user.role !== 'ADMIN')
      throw new ForbiddenException('Only admins can create tasks');

    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedUserId: data.assignedUserId,
      },
    });

    // AUDIT LOG
    await this.prisma.auditLog.create({
      data: {
        action: 'TASK_CREATED',
        details: `Admin ${req.user.email} created task: ${task.title}`,
        actorId: req.user.sub,
        taskId: task.id,
      },
    });

    return task;
  }

  @Get()
  async findAll(@Request() req: any) {
    if (req.user.role === 'ADMIN') {
      return this.prisma.task.findMany({ include: { assignedTo: true } });
    }
    return this.prisma.task.findMany({
      where: { assignedUserId: req.user.sub },
    });
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: +id } });

    if (req.user.role !== 'ADMIN' && task.assignedUserId !== req.user.sub) {
      throw new ForbiddenException('You cannot update this task');
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: +id },
      data: { status },
    });

    // AUDIT LOG
    await this.prisma.auditLog.create({
      data: {
        action: 'STATUS_CHANGE',
        details: `Status changed to ${status} by ${req.user.email}`,
        actorId: req.user.sub,
        taskId: updatedTask.id,
      },
    });

    return updatedTask;
  }
}
