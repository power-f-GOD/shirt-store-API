import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import { LoggerService, NormalizeResponseService } from 'src/utils';

@ApiTags('seed')
@Controller('seed')
export class SeedController {
  constructor(
    private seedService: SeedService,
    private logger: LoggerService,
    private response: NormalizeResponseService
  ) {
    this.logger.setContext(SeedController.name);
  }

  @Get('/shirts')
  async getShirts() {
    this.logger.debug('Getting all order item cost weights...');

    const shirts = await this.seedService.getShirts();

    return this.response.success(shirts);
  }
}
