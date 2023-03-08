import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class AuthenticateUserDto extends CreateUserDto {
  @ApiProperty({
    enum: ['login', 'logout', 'signup'],
    enumName: 'type',
    description: "The type of authentication: 'login'|'logout'."
  })
  @IsEnum(['login', 'logout', 'signup'], {
    message:
      "Authentication `type` must be one of 'login', 'logout' or 'signup'."
  })
  type: 'login' | 'logout' | 'signup';
}
