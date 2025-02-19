import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  short_name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  active_principle?: string;

  @IsString()
  @IsOptional()
  synonyms?: string;
}
