import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOrOwner } from '../auth/guards/admin-or-owner.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enum/role.enum';

@Controller('api')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('get-teachers')
  getTeachers(@Query('take') take: number, @Query('skip') skip: number) {
    return this.teacherService.findAllTeachers(take, skip);
  }

  @Get('get-teachers/:id')
  getTeacherById(@Param('id') id: string) {
    return this.teacherService.findTeacherById(id);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Patch('update-teacher/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwner)
  updateTeacher(
    @Param('userId') userId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacherByUserId(userId, updateTeacherDto);
  }

  @Patch('unactive-teacher/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  unactiveTeacher(@Param('id') id: string) {
    return this.teacherService.unactiveTeacher(id);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Delete('delete-teacher/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminOrOwner)
  deleteTeacher(@Param('userId') userId: string) {
    return this.teacherService.deleteTeacherByUserId(userId);
  }
}
