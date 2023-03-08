import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';

export class ErrorResponseDto {
  @ApiProperty({ type: Number })
  status: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({
    type: Object,
    properties: {
      statusCode: {
        type: 'number'
      },
      error: {
        type: 'string'
      },
      message: {
        type: 'string'
      }
    }
  })
  response: Response;
}
