import { Injectable } from '@nestjs/common';

@Injectable()
export class PrettifyService {
  pretty = <T = any>(object: T) => {
    try {
      return JSON.stringify(object, null, 2);
    } catch (e) {
      return String(object);
    }
  };
}
