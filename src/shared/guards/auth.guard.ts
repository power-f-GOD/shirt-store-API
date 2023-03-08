import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/domains/users/schemas';

import { IS_AUTHENTICATED_KEY } from '../decorators';
import { NormalizeResponseService } from '../services/normalize-response.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private response: NormalizeResponseService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const authenticated = this.reflector.getAllAndOverride<boolean>(
      IS_AUTHENTICATED_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (authenticated) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest() as {
      user: User;
    };

    if (user?.authenticated) return true;

    throw this.response.error(
      'You do not have the permission to access this resource as you have not yet been authenticated.',
      '',
      ForbiddenException
    );
  }
}
