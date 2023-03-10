import { Module } from '@nestjs/common';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';

import { BaseQueryDto, GatewayDto } from './dtos';
import {
  DTOValidatorService,
  LoggerService,
  NormalizeResponseService,
  SocketServerService,
  UtilsService
} from './services';

@Module({
  providers: [
    DTOValidatorService,
    LoggerService,
    NormalizeResponseService,
    ClassTransformer,
    Validator,
    UtilsService,
    SocketServerService,
    BaseQueryDto,
    GatewayDto
  ],
  exports: [
    BaseQueryDto,
    GatewayDto,
    DTOValidatorService,
    LoggerService,
    NormalizeResponseService,
    UtilsService,
    SocketServerService
  ]
})
export class SharedModule {}
