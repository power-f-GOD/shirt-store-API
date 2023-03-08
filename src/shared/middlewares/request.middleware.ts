import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/domains/users/users.service';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(request: Request, response: Response, next: NextFunction) {
    const id = request.headers.authorization?.split(' ')[1]?.trim();

    request.user = (id ? await this.usersService.getOne(id) : null) || {
      username: '',
      _id: '',
      authenticated: false
    };
    next();
  }
}
