import { Module } from '@nestjs/common';
import { ClassTransformer } from 'class-transformer';
import { Validator } from 'class-validator';
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
    UtilsService
  ],
  exports: [
    DTOValidatorService,
    LoggerService,
    NormalizeResponseService,
    PrettifyService,
    UtilsService
  ]
})
export class UtilsModule {}
