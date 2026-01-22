import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ minLength: 1, maxLength: 200 })
  @IsString()
  @Length(1, 200)
  password: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;
}
