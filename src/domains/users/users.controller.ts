import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos';
import {
  LoggerService,
  NormalizeResponseService,
  UtilsService
} from 'src/shared/services';
import { User } from './schemas';
import { ErrorResponseDto } from 'src/shared/dtos';
import { AppDomainNamesEnum } from 'src/enums';

@ApiTags(AppDomainNamesEnum.USERS)
@Controller(AppDomainNamesEnum.USERS)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private utils: UtilsService
  ) {}

  @ApiOperation({ summary: 'Create new user.' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  async create(@Body() body: CreateUserDto, @Req() request: Request) {
    this.logger.debug(
      `Creating user for user, ${
        request.user.name
      }, with payload: ${this.utils.prettify(body)}...`
    );

    try {
      return this.response.success(await this.usersService.create(body));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  @ApiOperation({
    summary: 'Get (existing) user (by `name`).'
  })
  @ApiFoundResponse({ type: User })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @Get(':name')
  async getOne(@Param('name') name: string) {
    this.logger.debug(`Getting user by name, ${name}...`);

    try {
      return this.response.success(await this.usersService.getOne(name));
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
