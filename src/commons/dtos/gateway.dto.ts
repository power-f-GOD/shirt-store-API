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

@Expose()
export class GatewayDto<DataType> {
  @IsEnum(GatewayPathsEnum)
  @IsOptional()
  path?: GatewayPathsEnum;

  @IsObject()
  @IsDefined()
  data: DataType;

  @IsString()
  @IsOptional()
  message?: string;

  @IsBoolean()
  @IsOptional()
  error?: boolean;
}
