import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Comment } from '../../comments/entities/comment.entity';

export enum UserRole {
  USER = 'USER',
  AUTHOR = 'AUTHOR',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ select: false })
  password: string;

  @Index()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true, select: false })
  refreshTokenHash: string | null;

  @OneToMany(() => Task, (t) => t.user)
  tasks: Task[];

  @OneToMany(() => Comment, (c) => c.user)
  comments: Comment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
