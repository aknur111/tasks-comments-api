import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) {}

  async create(userId: string, dto: CreateTaskDto) {
    const task = this.repo.create({ userId, description: dto.description });
    return this.repo.save(task);
  }

  async findAllSorted() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string) {
    const task = await this.repo.findOne({
      where: { id },
      relations: { comments: true },
      order: { comments: { createdAt: 'DESC' } } as any,
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async updateOwned(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('You are not the owner');

    await this.repo.update({ id: taskId }, { ...dto });
    return this.findById(taskId);
  }

  async deleteOwned(userId: string, taskId: string) {
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Task not found');
    if (task.userId !== userId) throw new ForbiddenException('You are not the owner');

    await this.repo.delete({ id: taskId });
    return { ok: true };
  }
}
