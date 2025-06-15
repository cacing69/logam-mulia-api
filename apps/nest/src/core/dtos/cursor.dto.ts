import { Exclude, Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CursorDto {
  @IsString()
  @IsOptional()
  lastId;

  @IsOptional()
  @IsObject()
  filter;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit = 10;
}
