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
import { Public } from 'src/shared/decorators';

@ApiTags(AppDomainNamesEnum.USERS)
@Controller(AppDomainNamesEnum.USERS)
@Public()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private response: NormalizeResponseService,
    private logger: LoggerService,
    private utils: UtilsService
  ) {
    this.logger.setContext(UsersController.name);
  }

  @ApiOperation({ summary: 'Create new user.' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    this.logger.debug(
      `Creating user for user with payload: ${this.utils.prettify(body)}...`
    );

    try {
      return this.response.success(
        await this.usersService.create(body),
        `Welcome to Shirt Store, ${body.username}!😎`
      );
    } catch (e: any) {
      const isConflict = /exists/.test(e.message);

      this.logger.error(e.message || e);
      throw this.response.error(
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
  @Get(':name_or_id')
  async getOneUser(@Param('name_or_id') nameOrId: string) {
    this.logger.debug(`Getting user by name (or id), ${nameOrId}...`);

    try {
      return this.response.success(await this.usersService.getOne(nameOrId));
    } catch (e: any) {
      this.logger.error(e.message || e);
      throw this.response.error(e.message || e);
    }
  }

  @ApiOperation({
    summary: 'Authenticate user (by `name`).'
  })
  @ApiFoundResponse(NormalizeResponseService.getSuccessSchema(User))
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @Post('authenticate')
  /** This is just for to mock authentication. In the real world, this should be done in an `AuthController`. */
  async authenticateUser(@Body() { username, type }: AuthenticateUserDto) {
    this.logger.debug(`Authenticating user by name, ${username}...`);

    try {
      const user = await this.usersService.authenticate(username, type);

      return this.response.success(
        user,
        type !== 'logout' ? 'Welcome!😎' : 'Logged out successfully.'
      );
    } catch (e: any) {
      this.logger.error(e.message || e);
      throw this.response.error(e.message || e);
    }
  }
}
