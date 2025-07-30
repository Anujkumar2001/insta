import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PostsPaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
