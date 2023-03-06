import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  prettify = <T = any>(object: T) => {
    try {
      return JSON.stringify(object, null, 2);
    } catch (e) {
      return String(object);
    }
  };

  isObject(subject: any) {
    if (typeof subject !== 'object' || Array.isArray(subject) || !subject) {
      return false;
    }

    return true;
  }

  isEmptyObject(object: Record<string, any>) {
    if (!this.isObject(object)) {
      throw Error(
        `Subject, ${object}, is not an object. Function expects an object as param.`
      );
    }

    let count = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _key in object) {
      count++;

      if (count) return false;
    }

    return true;
  }
}
