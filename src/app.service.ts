import { Injectable } from '@nestjs/common';
import { SeedService } from './domains/seed/seed.service';

@Injectable()
export class AppService {
  constructor(private seedService: SeedService) {
    this.seedService.seed();
  }

  sayHello() {
    return { 'Hello!': 'Shirt Store!' };
  }
}
