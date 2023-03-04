import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import {
  LoggerService,
  NormalizeResponseService,
  PrettifyService
} from 'src/utils';
import { User } from './schemas';

@Controller(`${User.name}s`)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private prettify: PrettifyService
  ) {}

  @Post()
  async create(@Body() body: CreateUserDto, @Req() request: Request) {
    this.logger.debug(
      `Creating user for user, ${
        request.user.name
      }, with payload: ${this.prettify.pretty(body)}...`
    );

    try {
      return this.response.success(await this.usersService.create(body));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  @Get(':name')
  async getOne(@Param('name') name: string) {
    this.logger.debug(`Getting user with name, ${name}...`);

    try {
      return this.response.success(await this.usersService.getOne(name));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
