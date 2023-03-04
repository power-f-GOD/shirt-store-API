import { Module } from '@nestjs/common';

import { BaseQueryDto, GatewayDto } from './dtos';

@Module({
  exports: [BaseQueryDto, GatewayDto]
})
export class CommonsModule {}
