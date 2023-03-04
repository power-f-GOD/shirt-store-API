import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import {
  ClassConstructor,
  ClassTransformer,
  ClassTransformOptions
} from 'class-transformer';
import { Validator } from 'class-validator';

import { LoggerService } from './logger.service';
import { UtilsService } from './utils.service';
import { NormalizeResponseService } from './normalize-response.service';

@Injectable()
export class DTOValidatorService {
  constructor(
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private transformer: ClassTransformer,
    private validator: Validator,
    private utils: UtilsService
  ) {}

  private async validate<DataType = any>(
    dto: ClassConstructor<any>,
    data: DataType,
    options?: ClassTransformOptions
  ) {
    await this.validator.validateOrReject(
      dto.name,
      this.transformer.plainToInstance(dto, data, {
        ...(options || {}),
        excludeExtraneousValues: true
      })
    );
  }

  async gateway<DataType extends Record<string, any> = Record<string, any>>(
    dto: ClassConstructor<any>,
    data: DataType,
    options?: ClassTransformOptions,
    excludeForNumberConversion?: Partial<Record<keyof DataType, any>>
  ) {
    this.purify(data, excludeForNumberConversion);

    try {
      await this.validate<DataType>(dto, data, options);
    } catch (e: any) {
      // Revisit: To-do: Create a recursive function to extract `constraints`.
      const validationErrors =
        e?.[0]?.constraints || e?.[0]?.children?.[0]?.constraints;
      e?.[0]?.children?.[0]?.children?.[0]?.constraints || {};

      const message = !this.utils.isEmptyObject(validationErrors)
        ? Object.keys(validationErrors).map((name) => validationErrors[name])
        : `Hughh.🤦🏾 A fatal gateway error occurred while trying to process your request. It's not you, it's us. We'll look into it.🙏🏾`;

      throw new WsException({
        message: Array.isArray(message) ? message.join(' ') : message,
        error: true
      });
    }
  }

  async http<DataType extends Record<string, any>>(
    dto: ClassConstructor<any>,
    data: DataType,
    options?: ClassTransformOptions,
    excludeForNumberConversion?: Partial<Record<keyof DataType, any>>
  ) {
    this.purify(data, excludeForNumberConversion);

    try {
      await this.validate<DataType>(dto, data, options);
    } catch (e: any) {
      const validationErrors =
        e[0].constraints || e[0].children[0].children[0].constraints || {};

      this.logger.error(e);
      throw this.response.error(
        !this.utils.isEmptyObject(validationErrors)
          ? Object.keys(validationErrors).map((name) => validationErrors[name])
          : `Hughh.🤦🏾 A fatal HTTP error occurred while trying to process your request. It's not you, it's us. We'll look into it.🙏🏾`,
        undefined,
        BadRequestException
      );
    }
  }

  /**
   * Basically removes `undefined` fields to avoid bugs (mostly after a spread) and converts number strings to number.
   * @param data Data/Object to purify.
   */
  purify<DataType extends Record<string, any>>(
    data: DataType,
    excludeForNumberConversion?: Partial<Record<keyof DataType, any>>
  ) {
    for (const key in data) {
      if (data[key] === undefined || data[key] === 'undefined') {
        delete data[key];
      } else if (
        (!excludeForNumberConversion || !(key in excludeForNumberConversion)) &&
        /^\s*(\d|\.)/.test(String(data[key])) &&
        !isNaN(+data[key]) &&
        typeof data[key] !== 'boolean'
      ) {
        data[key] = +data[key] as any;
      }
    }
  }
}
