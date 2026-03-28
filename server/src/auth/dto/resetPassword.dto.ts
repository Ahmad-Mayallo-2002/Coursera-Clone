import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  newPassword!: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  confirmNewPassword!: string;
}
