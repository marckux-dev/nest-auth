import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  // @IsEmail()
  // readonly email: string;

  @IsString()
  @MinLength(2)
  readonly full_name: string;

  @IsString()
  @MinLength(1)
  readonly password: string;
}
