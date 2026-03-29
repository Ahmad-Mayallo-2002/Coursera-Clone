import {
  IsEnum,
  IsNumber,
  IsString,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { RatingType } from '../../enum/ratingType.enum';

export class CreateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  value!: number;

  @IsEnum(RatingType)
  type!: RatingType;

  @ValidateIf((obj) => obj.type === RatingType.COURSE)
  @IsString()
  courseId?: string;

  @ValidateIf((obj) => obj.type === RatingType.TEACHER)
  @IsString()
  teacherId?: string;
}
