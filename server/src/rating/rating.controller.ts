import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../enum/role.enum';

@Controller('api')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Roles(Role.ADMIN, Role.TEACHER)
  @Post('add-rating')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addRating(
    @Req() req: Request,
    @Body() createRatingDto: CreateRatingDto,
  ) {
    const user = req.user as { id: string };
    if (!user?.id) {
      throw new BadRequestException('Authenticated user required');
    }
    return this.ratingService.addOrUpdateRating(user.id, createRatingDto);
  }

  @Get('get-teacher-avg-rating/:teacherId')
  getTeacherAvgRating(@Param('teacherId') teacherId: string) {
    return this.ratingService.getTeacherAvgRating(teacherId);
  }

  @Get('get-course-avg-rating/:courseId')
  getCourseAvgRating(@Param('courseId') courseId: string) {
    return this.ratingService.getCourseAvgRating(courseId);
  }
}
