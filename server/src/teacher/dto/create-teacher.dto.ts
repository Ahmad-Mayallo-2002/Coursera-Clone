import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  bio!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  experience!: string;
}
