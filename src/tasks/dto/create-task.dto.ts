import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ minLength: 1, maxLength: 1000 })
  @IsString()
  @Length(1, 1000)
  description: string;
}
