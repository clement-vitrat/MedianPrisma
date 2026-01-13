import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  accessTokenExpiresAt: string;
}
