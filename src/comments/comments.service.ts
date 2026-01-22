import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>,
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    const task = await this.tasksRepo.findOne({ where: { id: dto.taskId } });
    if (!task) throw new NotFoundException('Task not found');

    const comment = this.repo.create({
      userId,
      taskId: dto.taskId,
      text: dto.text,
    });

    return this.repo.save(comment);
  }

  async listByTask(taskId: string) {
    return this.repo.find({
      where: { taskId },
      order: { createdAt: 'DESC' },
    });
  }

  async getById(id: string) {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }

  async updateOwned(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.getById(id);
    if (comment.userId !== userId) throw new ForbiddenException('You are not the owner');

    await this.repo.update({ id }, { ...dto });
    return this.getById(id);
  }

  async deleteOwned(userId: string, id: string) {
    const comment = await this.getById(id);
    if (comment.userId !== userId) throw new ForbiddenException('You are not the owner');

    await this.repo.delete({ id });
    return { ok: true };
  }
}
