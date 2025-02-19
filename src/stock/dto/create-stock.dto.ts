import { IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateStockDto {
  @IsUUID()
  centerId: string;

  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(0)
  maximum_storage: number;

  @IsNumber()
  @Min(0)
  current_storage: number;

  @IsString()
  @IsOptional()
  @MinLength(1)
  stock_category?: string
}
