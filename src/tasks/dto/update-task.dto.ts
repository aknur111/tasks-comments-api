import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTaskDto {
  @ApiPropertyOptional({ minLength: 1, maxLength: 1000 })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;
}
