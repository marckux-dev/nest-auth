import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateStockDto {
  @IsOptional()
  @Transform(({ value }) => (value !== null ? parseInt(value, 10) : value))
  @IsNumber()
  @IsInt()
  @Min(0)
  maximum_storage?: number;

  @IsOptional()
  @Transform(({ value }) => (value !== null ? parseInt(value, 10) : value))
  @IsNumber()
  @IsInt()
  @Min(0)
  current_storage?: number;
}
