import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShirtSeed, ShirtSeedSchema } from './schemas';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShirtSeed.name, schema: ShirtSeedSchema }
    ]),
    UtilsModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}
