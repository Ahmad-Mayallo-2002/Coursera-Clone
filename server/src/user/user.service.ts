import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../enum/role.enum';
import { hash } from 'bcryptjs';
import { paginationCalculation } from '../utils/paginationCalculation';
import { PaginatedData } from '../interfaces/pagination.interface';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findAllStudents(
    take: number,
    skip: number,
  ): Promise<PaginatedData<User>> {
    const [data, count] = await this.userRepo.findAndCount({
      where: { role: Role.STUDENT },
      select: {
        password: false,
      },
      take,
      skip,
    });
    if (!data.length) throw new NotFoundException('No Students Found');
    const pagination = paginationCalculation(count, take, skip);
    return { data, pagination };
  }

  async findStudentById(id: string): Promise<User> {
    // Lazy Loading Caching Technique
    const cachedStudent = await this.cache.get<User>(`student-${id}`);
    if (cachedStudent) return cachedStudent;
    const student = await this.userRepo.findOne({
      where: { id, role: Role.STUDENT },
      select: {
        password: false,
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    await this.cache.set(`student-${id}`, student, 1000 * 60 * 60 * 24);
    return student;
  }

  async updateUser(
    id: string,
    input: UpdateUserDto,
    req?: Request,
  ): Promise<User> {
    const user = await this.findStudentById(id);

    if (input.password) user.password = await hash(input.password, 10);
    if (input.email) {
      const currentEmailUser = await this.userRepo.findOneBy({
        email: input.email,
      });
      if (currentEmailUser)
        throw new ConflictException('This Email is Already Used');
    }
    if (input.username) user.username = input.username;

    const savedStudent = await this.userRepo.save(user);
    await this.cache.set(`student-${id}`, savedStudent, 1000 * 60 * 60 * 24);
    return savedStudent;
  }

  async updateStudentImage(id: string, image: string): Promise<User> {
    const student = await this.findStudentById(id);
    student.image = image;
    const savedStudent = await this.userRepo.save(student);
    await this.cache.set(`student-${id}`, savedStudent, 1000 * 60 * 60 * 24);
    return savedStudent;
  }

  async deleteUser(id: string) {
    const student = await this.findStudentById(id);
    await this.userRepo.remove(student);
    return true;
  }
}
