import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async create(data: { password: string; role: UserRole }) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // нужно для login (password скрыт по умолчанию)
  async findByIdWithPassword(id: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.id = :id', { id })
      .getOne();
  }

  async findByIdWithRefreshHash(id: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.refreshTokenHash')
      .where('u.id = :id', { id })
      .getOne();
  }

  async setRefreshTokenHash(id: string, hash: string | null) {
    await this.repo.update({ id }, { refreshTokenHash: hash });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);

    const patch: Partial<User> = {};
    if (dto.role) patch.role = dto.role;

    if (dto.password) {
      patch.password = await bcrypt.hash(dto.password, 10);
    }

    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  async remove(id: string) {
    await this.findById(id);
    await this.repo.delete({ id });
    return { ok: true };
  }
}
