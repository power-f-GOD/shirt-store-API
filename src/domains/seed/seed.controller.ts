import { Controller, Get } from '@nestjs/common';
import { ApiFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
import { LoggerService, NormalizeResponseService } from 'src/shared/services';
import { AppDomainNamesEnum } from 'src/enums';
import { ShirtSeed } from './schemas';

@ApiTags(AppDomainNamesEnum.SEED)
@Controller(AppDomainNamesEnum.SEED)
export class SeedController {
  constructor(
    private seedService: SeedService,
    private logger: LoggerService,
    private response: NormalizeResponseService
  ) {
    this.logger.setContext(SeedController.name);
  }

  @ApiOperation({
    summary: 'Get all shirts sold (or available) in Shirt Store.'
  })
  @ApiFoundResponse({ type: ShirtSeed, isArray: true })
  @Get('/shirts')
  async getShirts() {
    this.logger.debug('Getting all shirts sold (or available)...');

    const shirts = await this.seedService.getShirts();

    return this.response.success(shirts);
  }
}
