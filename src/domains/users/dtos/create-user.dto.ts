import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../schemas';

export class CreateUserDto implements Pick<User, 'username'> {
  @ApiProperty({
    type: String,
    description: 'The (unique) name of the `user`.',
    example: 'John Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
