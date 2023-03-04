import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

import { PrettifyService } from './prettify.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  constructor(private prettify: PrettifyService) {
    super();
  }

  private getCallerWithMessage(message: string, stack?: string) {
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
        : Object.keys(message).length
        ? this.prettify.pretty(message)
        : message
    } ${stack ? `- ${stack}` : ''}`;
  }

  log(message: any, context?: string) {
    super.log(this.getCallerWithMessage(message), context);
  }

  debug(message: any, context?: string) {
    super.debug(this.getCallerWithMessage(message), context);
  }

  warn(message: any, context?: string) {
    super.warn(this.getCallerWithMessage(message), context);
  }

  verbose(message: any, optionalParams_0: any, optionalParams_1?: string) {
    super.verbose(
      this.getCallerWithMessage(message),
      optionalParams_0,
      optionalParams_1
    );
  }

  error(message: any, stack?: string, context?: string) {
    super.error(
      this.getCallerWithMessage(message, stack || message.stack),
      stack,
      context
    );
  }
}
