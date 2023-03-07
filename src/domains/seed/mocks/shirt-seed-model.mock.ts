import { ShirtSeed } from '../schemas';
import { shirtSeedsMock } from './data';

export class ShirtSeedModelMock {
  async create(
    shirtSeed: ShirtSeed
  ): Promise<ShirtSeed & { save?: () => void }> {
    return { ...shirtSeedsMock[0], ...shirtSeed, save: () => undefined };
  }

  async find(): Promise<ShirtSeed[]> {
    return shirtSeedsMock;
  }

  async findOne(name: string): Promise<ShirtSeed | undefined | null> {
    return shirtSeedsMock.find((shirt) => shirt.name === name);
  }
}
