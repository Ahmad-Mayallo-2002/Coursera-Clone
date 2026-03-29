import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { paginationCalculation } from '../utils/paginationCalculation';
import { PaginatedData } from '../interfaces/pagination.interface';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async findAllTeachers(take = 10, skip = 0): Promise<PaginatedData<Teacher>> {
    const [data, count] = await this.teacherRepo.findAndCount({
      take,
      skip,
      relations: ['user'],
    });

    if (!data.length) throw new NotFoundException('No Teachers Found');

    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }

  async findTeacherById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async findTeacherByUserId(userId: string): Promise<Teacher> {
    const teacher = await this.teacherRepo.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async updateTeacherByUserId(
    userId: string,
    input: UpdateTeacherDto,
  ): Promise<Teacher> {
    const teacher = await this.findTeacherByUserId(userId);

    if (input.bio) teacher.bio = input.bio;
    if (input.experience) teacher.experience = input.experience;

    return await this.teacherRepo.save(teacher);
  }

  async unactiveTeacher(id: string): Promise<Teacher> {
    const teacher = await this.findTeacherById(id);
    teacher.isActive = false;
    return await this.teacherRepo.save(teacher);
  }

  async deleteTeacherByUserId(userId: string): Promise<boolean> {
    const teacher = await this.findTeacherByUserId(userId);
    await this.teacherRepo.remove(teacher);
    return true;
  }
}
