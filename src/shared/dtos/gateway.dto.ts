import {
  IsString,
  IsEnum,
  IsDefined,
  IsObject,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { Expose } from 'class-transformer';

import { GatewayPathsEnum } from '../../enums';

export class GatewayDto<DataType> {
  @Expose()
  @IsEnum(GatewayPathsEnum)
  @IsOptional()
  path?: GatewayPathsEnum;

  @Expose()
  @IsObject()
  @IsDefined()
  data: DataType;

  @Expose()
  @IsString()
  @IsOptional()
  message?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  error?: boolean;
}
