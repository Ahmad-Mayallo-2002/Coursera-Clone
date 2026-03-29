import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(input: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findOneBy({
      name: input.name,
    });

    if (existing) throw new ConflictException('Category already exists');

    const category = this.categoryRepo.create(input);
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, input: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (input.name) category.name = input.name;
    return await this.categoryRepo.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return true;
  }
}
