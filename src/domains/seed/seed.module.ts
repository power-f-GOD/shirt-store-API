import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ShirtSeed, ShirtSeedSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShirtSeed.name, schema: ShirtSeedSchema }
    ]),
    SharedModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}
