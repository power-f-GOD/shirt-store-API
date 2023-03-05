import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  error: string;
}
