import { PartialType } from '@nestjs/mapped-types';
import { RegisterDto } from '../../auth/dto/register.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsNotEmpty()
  @IsString()
  image!: string;
}
