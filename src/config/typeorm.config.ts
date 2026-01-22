import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';
import { Comment } from '../comments/entities/comment.entity';

export function typeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER || 'crm',
    password: process.env.DB_PASS || 'crm',
    database: process.env.DB_NAME || 'crm',
    entities: [User, Task, Comment],
    synchronize: true,
    logging: false,
  };
}
