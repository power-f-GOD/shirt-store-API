import { Module } from '@nestjs/common';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';
import { SocketServerService } from './socket-server.service';
import { DTOValidatorService } from './dto-validator.service';
import { LoggerService } from './logger.service';
import { NormalizeResponseService } from './normalize-response.service';
import { PrettifyService } from './prettify.service';
import { UtilsService } from './utils.service';

@Module({
  providers: [
    DTOValidatorService,
    LoggerService,
    NormalizeResponseService,
    PrettifyService,
    ClassTransformer,
    Validator,
    UtilsService,
    SocketServerService
  ],
  exports: [
    DTOValidatorService,
    LoggerService,
    NormalizeResponseService,
    PrettifyService,
    UtilsService,
    SocketServerService
  ]
})
export class UtilsModule {}
