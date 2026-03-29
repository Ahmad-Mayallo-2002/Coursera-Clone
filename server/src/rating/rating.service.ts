import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './entities/rating.entity';
import { RatingType } from '../enum/ratingType.enum';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async addOrUpdateRating(userId: string, createRatingDto: CreateRatingDto) {
    const { type, value, courseId, teacherId } = createRatingDto;

    const where: FindOptionsWhere<Rating> = {
      userId,
      type,
      courseId: type === RatingType.COURSE ? courseId : undefined,
      teacherId: type === RatingType.TEACHER ? teacherId : undefined,
    };

    const existingRating = await this.ratingRepository.findOne({ where });

    if (existingRating) {
      existingRating.value = value;
      return this.ratingRepository.save(existingRating);
    }

    const createObject: DeepPartial<Rating> = {
      userId,
      value,
      type,
      user: { id: userId },
    };

    if (type === RatingType.COURSE) {
      createObject.course = { id: createRatingDto.courseId };
      createObject.courseId = createRatingDto.courseId;
    }
    if (type === RatingType.TEACHER) {
      createObject.teacher = { id: createRatingDto.teacherId };
      createObject.teacherId = createRatingDto.teacherId;
    }

    const rating = this.ratingRepository.create(createObject);

    return this.ratingRepository.save(rating);
  }

  async getTeacherAvgRating(teacherId: string) {
    return await this.ratingRepository.average('value', {
      teacherId,
      type: RatingType.TEACHER,
    });
  }

  async getCourseAvgRating(courseId: string) {
    return await this.ratingRepository.average('value', {
      courseId,
      type: RatingType.COURSE,
    });
  }
}
