import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}
  @Post()
  @Roles('AUTHOR')
  create(@Req() req: any, @Body() dto: CreateCommentDto) {
    return this.comments.create(req.user.sub, dto);
  }
  @Get()
  list(@Query('task_id') taskId: string) {
    return this.comments.listByTask(taskId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.comments.getById(id);
  }
  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.comments.updateOwned(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.comments.deleteOwned(req.user.sub, id);
  }
}
