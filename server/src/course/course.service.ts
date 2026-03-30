import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Raw, Repository } from 'typeorm';
import { PaginatedData } from '../interfaces/pagination.interface';
import { paginationCalculation } from '../utils/paginationCalculation';
import { WhereTypeORM } from '../types/where-typeorm.type';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
  ) {}

  async getCourses(
    take: number,
    skip: number,
    categoryId?: string,
    rating?: number,
  ): Promise<PaginatedData<Course>> {
    const where: WhereTypeORM<Course> = {};
    if (categoryId) where.categoryId = categoryId;
    if (rating)
      where.rating = rating < 5 ? Between(rating, rating + 1) : Equal(5);
    const [data, count] = await this.courseRepo.findAndCount({
      take,
      skip,
      where,
    });
    if (!data.length) throw new NotFoundException('No Courses Found');
    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }

  async getCourseById(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('No Course Found');
    return course;
  }

  async getTeacherCourses(
    teacherId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedData<Course>> {
    const [data, count] = await this.courseRepo.findAndCount({
      take,
      skip,
      where: { teacherId },
    });
    if (!data.length)
      throw new NotFoundException('No Courses Found For This Teacher');
    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }

  async getCourseByCategoryId(
    categoryId: string,
    take: number,
    skip: number,
  ): Promise<PaginatedData<Course>> {
    const [data, count] = await this.courseRepo.findAndCount({
      take,
      skip,
      where: { categoryId },
    });
    if (!data.length)
      throw new NotFoundException('No Courses Found About This Category');
    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }

  async searchCourse(
    search: string,
    take: number,
    skip: number,
    categoryId?: string,
  ): Promise<PaginatedData<Course>> {
    const where: WhereTypeORM<Course> = {
      title: Raw((alias) => `${alias} ~* :search`, { search }),
    };
    if (categoryId) where.categoryId = categoryId;
    const [data, count] = await this.courseRepo.findAndCount({ where });
    if (!data.length)
      throw new NotFoundException('No Courses Found About This Category');
    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }
}
