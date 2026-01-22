import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Post()
  @Roles('USER')
  create(@Req() req: any, @Body() dto: CreateTaskDto) {
    return this.tasks.create(req.user.sub, dto);
  }

  @Get()
  findAll() {
    return this.tasks.findAllSorted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasks.findById(id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasks.updateOwned(req.user.sub, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.tasks.deleteOwned(req.user.sub, id);
  }
}
