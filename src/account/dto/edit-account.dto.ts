import { ApiProperty } from '@nestjs/swagger';

export class EditAccountRequest {
  @ApiProperty({ required: false })
  login?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ type: [String], required: false })
  roles?: string[];

  @ApiProperty({ required: false })
  status?: string;
}
