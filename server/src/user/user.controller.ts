import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOrOwner } from '../auth/guards/admin-or-owner.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getStudents(@Query('take') take: number, @Query('skip') skip: number) {
    return this.userService.findAllStudents(take, skip);
  }

  @Get('get-students/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  getStudentById(@Param('userId') userId: string) {
    return this.userService.findStudentById(userId);
  }

  @Patch('update-student/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  updateStudent(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateStudent(userId, updateUserDto);
  }

  @Delete('delete-student/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  deleteStudent(@Param('userId') userId: string) {
    return this.userService.deleteStudent(userId);
  }
}
