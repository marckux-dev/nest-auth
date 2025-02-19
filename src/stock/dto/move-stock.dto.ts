import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class MoveStockDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  stock_category?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== null ? parseInt(value, 10) : value))
  @IsNumber()
  @IsInt()
  @Min(0)
  stock_order?: number;
}