import { IsString, MinLength } from 'class-validator';

export class CreateCenterDto {
  @IsString()
  @MinLength(1)
  name: string;
}
