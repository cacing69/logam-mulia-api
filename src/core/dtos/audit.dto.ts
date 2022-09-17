import { IsNumber, IsOptional } from 'class-validator';

export class AuditDto {
  @IsNumber()
  @IsOptional()
  createdBy?: number;

  @IsNumber()
  @IsOptional()
  updatedBy?: number;

  @IsNumber()
  @IsOptional()
  deletedBy?: number;

  @IsOptional()
  deletedAt?: Date;
}
