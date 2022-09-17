import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit = 10;
}
