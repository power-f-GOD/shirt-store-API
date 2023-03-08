import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

import { UtilsService } from './utils.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private utils: UtilsService) {
    super();
  }

  log(message: unknown, context?: string) {
    super.log(this.getCallerWithMessage(message), context);
  }

  debug(message: unknown, context?: string) {
    super.debug(this.getCallerWithMessage(message), context);
  }

  warn(message: unknown, context?: string) {
    super.warn(this.getCallerWithMessage(message), context);
  }

  verbose(message: unknown, optionalParams_0: any, optionalParams_1?: string) {
    super.verbose(
      this.getCallerWithMessage(message),
      optionalParams_0,
      optionalParams_1
    );
  }

  error(e: any, stack?: string, context?: string) {
    super.error(this.getCallerWithMessage(e, stack || e.stack), stack, context);
  }

  private getCallerWithMessage(message: unknown, stack?: string) {
    return `<<${
      ((/at \w+\.(\w+)/.exec(new Error().stack!.split('\n')[3]) || '')[1] ||
        this.context ||
        'unidentifiable') + ' '
    }${
      /service/i.test(this.context || '')
        ? 'method'
        : `${/controller/i.test(this.context || '') ? 'route ' : ''}handler`
    }>> ${
      typeof message === 'string'
        ? message
        : this.utils.isObject(message)
        ? this.utils.prettify(message)
        : message
    } ${stack ? `- ${stack}` : ''}`;
  }
}
