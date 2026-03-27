import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  username!: string;
}
