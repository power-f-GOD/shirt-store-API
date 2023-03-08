import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../decorators';
import { NormalizeResponseService } from '../services/normalize-response.service';

@Injectable()
export class CustomAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private response: NormalizeResponseService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (isPublic) return true;

    const { user }: Request = context.switchToHttp().getRequest();

    if (user?.authenticated) return true;

    throw this.response.error(
      'You do not have the permission to access this resource as you have not yet been authenticated.',
      '',
      ForbiddenException
    );
  }
}
