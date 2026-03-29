import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminOrOwner } from '../auth/guards/admin-or-owner.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enum/role.enum';
import type { Request } from 'express';
import { busboyUploader } from '../utils/busboyUploader';

@Controller('api')
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

  @Patch('update-user/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  updateStudent(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('delete-user/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  updateUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Patch('update-user-image/:userId')
  @UseGuards(JwtAuthGuard, AdminOrOwner)
  async updateUserImage(@Param('userId') userId: string, @Req() req: Request) {
    try {
      const result = await busboyUploader(req);
      if (result.category !== 'image')
        throw new BadRequestException('Only image uploads are allowed');
      const imageUrl = `/uploads/${result.category}s/${result.fileName}`;
      return this.userService.updateStudentImage(userId, imageUrl);
    } catch (error) {
      throw new BadRequestException(error ?? 'Uploading Error');
    }
  }
}
