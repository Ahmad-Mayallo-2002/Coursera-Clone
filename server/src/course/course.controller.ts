import { Controller, Get, Param, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { PaginatedData } from '../interfaces/pagination.interface';
import { Course } from './entities/course.entity';

@Controller('api')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('get-courses')
  async getCourses(
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('categoryId') categoryId?: string,
    @Query('rating') rating?: number,
  ): Promise<PaginatedData<Course>> {
    return this.courseService.getCourses(take, skip, categoryId, rating);
  }

  @Get('get-courses/:id')
  async getCourseById(@Param('id') id: string): Promise<Course> {
    return this.courseService.getCourseById(id);
  }

  @Get('get-courses/teacher/:teacherId')
  async getTeacherCourses(
    @Param('teacherId') teacherId: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedData<Course>> {
    return this.courseService.getTeacherCourses(teacherId, take, skip);
  }

  @Get('get-courses/category/:categoryId')
  async getCourseByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
  ): Promise<PaginatedData<Course>> {
    return this.courseService.getCourseByCategoryId(categoryId, take, skip);
  }

  @Get('search-courses')
  async searchCourse(
    @Query('search') search: string,
    @Query('take') take: number,
    @Query('skip') skip: number,
    @Query('categoryId') categoryId?: string,
  ): Promise<PaginatedData<Course>> {
    return this.courseService.searchCourse(search, take, skip, categoryId);
  }
}
