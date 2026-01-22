import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;

  @ApiProperty({ minLength: 1, maxLength: 1000 })
  @IsString()
  @Length(1, 1000)
  text: string;
}
