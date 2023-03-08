import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ConflictException
} from '@nestjs/common';
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
import { AuthenticateUserDto, CreateUserDto } from './dtos';
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
  async create(@Body() body: CreateUserDto) {
    this.logger.debug(
      `Creating user for user with payload: ${this.utils.prettify(body)}...`
    );

    try {
      return this.response.success(await this.usersService.create(body));
    } catch (e: any) {
      const isConflict = /exists/.test(e.message);

      this.logger.error(e.message || e);
      return this.response.error(
        e,
        e,
        isConflict ? ConflictException : undefined
      );
    }
  }

  @ApiOperation({
    summary: 'Get (existing) user (by `name`).'
  })
  @ApiFoundResponse(NormalizeResponseService.getSuccessSchema(User))
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

  @ApiOperation({
    summary: 'Authenticate user (by `name`).'
  })
  @ApiFoundResponse(NormalizeResponseService.getSuccessSchema(User))
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @Post('authenticate')
  /** This is just for to mock authentication. In the real world, this should be done in an `AuthController`. */
  async authenticate(@Body() { name, type }: AuthenticateUserDto) {
    this.logger.debug(`Authenticating user by name, ${name}...`);

    try {
      return this.response.success(
        await this.usersService.authenticate(name, type)
      );
    } catch (e: any) {
      this.logger.error(e.message || e);
      return this.response.error(e.message || e);
    }
  }
}
