import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenRequest {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  from?: string;
}
