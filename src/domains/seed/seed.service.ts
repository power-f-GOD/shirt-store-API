import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LoggerService } from 'src/shared/services';
import { ShirtSeed, ShirtSeedDocument } from './schemas';
import { shirtSeeds } from './data';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(ShirtSeed.name)
    private shirtSeedModel: Model<ShirtSeedDocument>,
    private logger: LoggerService
  ) {
    this.logger.setContext(SeedService.name);
  }

  seed() {
    this.seedShirts();
  }

  async getShirts(): Promise<ShirtSeed[]> {
    return await this.shirtSeedModel.find();
  }

  async findOneShirt(id: string) {
    return await this.shirtSeedModel.findById(id);
  }

  async seedShirts() {
    this.logger.debug(`Seeding shirts collection...`);
    try {
      await Promise.all(
        shirtSeeds.map(async (shirtSeed) => {
          const existingShirt = await this.shirtSeedModel.findOne({
            name: shirtSeed.name
          });
          const shirt = new this.shirtSeedModel(shirtSeed);

          shirt.isNew = !existingShirt;
          if (existingShirt) shirt._id = existingShirt._id;
          await shirt.save();
        })
      );
      this.logger.debug(`Finished seeding shirts collection.`);
    } catch (e: any) {
      this.logger.debug(
        `An error, "${e}", occurred while seeding shirts collection.`
      );
    }
  }
}
