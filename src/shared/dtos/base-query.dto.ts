import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class BaseQueryDto {
  @ApiPropertyOptional({
    type: Number,
    description: 'Specifies the number of documents to skip.'
  })
  @Expose()
  @IsOptional()
  @IsNumber()
  skip?: number;

  @ApiPropertyOptional({
    type: Number,
    description:
      'Specifies the maximum number of documents the query will return.'
  })
  @Expose()
  @IsOptional()
  @IsNumber()
  count?: number;
}
