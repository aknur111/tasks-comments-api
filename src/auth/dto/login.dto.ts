import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'User UUID' })
  @IsUUID()
  id: string;

  @ApiProperty({ minLength: 1, maxLength: 200 })
  @IsString()
  @Length(1, 200)
  password: string;
}
