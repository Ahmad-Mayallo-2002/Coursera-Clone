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
import busboy from 'busboy';

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

  async updateStudent(id: string, input: UpdateUserDto): Promise<User> {
    const user = await this.findStudentById(id);

    for (const key in input) {
      if (key === 'password' && input[key])
        user.password = await hash(input[key], 10);
      if (key === 'email' && input[key]) {
        const currentEmailUser = await this.userRepo.findOneBy({
          email: input[key],
        });
        if (currentEmailUser)
          throw new ConflictException('This Email is Already Used');
      }
      if (input[key]) user[key] = input[key];
    }

    return await this.userRepo.save(user);
  }

  async deleteStudent(id: string) {
    const student = await this.findStudentById(id);
    await this.userRepo.remove(student);
    return true;
  }
}
