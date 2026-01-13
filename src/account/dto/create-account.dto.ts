import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountRequest {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ type: [String], required: false })
  roles?: string[];

  @ApiProperty({ required: false })
  status?: string;
}
